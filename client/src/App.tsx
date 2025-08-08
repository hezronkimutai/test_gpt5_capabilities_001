import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { io, Socket } from 'socket.io-client';
import { Chess } from 'chess.js';

type Move = { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' };

function Square({
  square,
  piece,
  onClick,
  highlight,
}: {
  square: string;
  piece: string | null;
  onClick: (sq: string) => void;
  highlight?: boolean;
}) {
  const isDark = useMemo(() => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return (file + rank) % 2 === 1;
  }, [square]);
  return (
    <div
      onClick={() => onClick(square)}
      style={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: highlight ? '#f6f669' : isDark ? '#769656' : '#eeeed2',
        fontSize: 32,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      title={square}
    >
      {piece}
    </div>
  );
}

function Board({ chess, onMove }: { chess: Chess; onMove: (m: Move) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const legalMoves = useMemo(() => {
    if (!selected) return [] as string[];
    // chess.js types expect a Square type; cast for simplicity
    return (chess.moves({ square: selected as any, verbose: true }) as any[]).map(
      (m) => m.to as string,
    );
  }, [selected, chess]);

  const piecesMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    const b = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = b[r][f] as any;
        const file = String.fromCharCode('a'.charCodeAt(0) + f);
        const rank = (8 - r).toString();
        const sq = `${file}${rank}`;
        if (p) {
          const sym = (p.color === 'w' ? p.type.toUpperCase() : p.type).replace(
            'k', '♚'
          )
            .replace('q', '♛')
            .replace('r', '♜')
            .replace('b', '♝')
            .replace('n', '♞')
            .replace('p', '♟');
          const mapping: Record<string, string> = {
            K: '♔',
            Q: '♕',
            R: '♖',
            B: '♗',
            N: '♘',
            P: '♙',
            '♚': '♚',
            '♛': '♛',
            '♜': '♜',
            '♝': '♝',
            '♞': '♞',
            '♟': '♟',
          };
          map[sq] = mapping[sym] ?? sym;
        }
      }
    }
    return map;
  }, [chess]);

  const handleSquare = (sq: string) => {
    if (!selected) {
      setSelected(sq);
      return;
    }
    if (selected === sq) {
      setSelected(null);
      return;
    }
    const move: Move = { from: selected, to: sq };
    onMove(move);
    setSelected(null);
  };

  const rows: any[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    const cells: any[] = [];
    for (let file = 0; file < 8; file++) {
      const sq = `${String.fromCharCode('a'.charCodeAt(0) + file)}${rank}`;
      cells.push(
        <Square
          key={sq}
          square={sq}
          piece={piecesMap[sq] ?? null}
          highlight={selected === sq || legalMoves.includes(sq)}
          onClick={handleSquare}
        />,
      );
    }
    rows.push(
      <div key={rank} style={{ display: 'flex' }}>
        {cells}
      </div>,
    );
  }

  return <div>{rows}</div>;
}

function App() {
  const [serverUrl] = useState<string>(
    `${location.protocol}//${location.hostname}:3000`,
  );
  const [gameId, setGameId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const socketRef = useRef<Socket | null>(null);
  const [chess] = useState(() => new Chess());
  const [, setTick] = useState(0);

  useEffect(() => {
    const s = io(serverUrl, { transports: ['websocket'] });
    socketRef.current = s;
    s.on('connect', () => setStatus('connected'));
    s.on('disconnect', () => setStatus('disconnected'));
    s.on('state', ({ game }: any) => {
      if (game?.pgn) {
        chess.reset();
        chess.loadPgn(game.pgn);
        setTick((x) => x + 1);
      }
    });
    s.on('moved', ({ pgn }: any) => {
      chess.reset();
      chess.loadPgn(pgn);
      setTick((x) => x + 1);
    });
    return () => {
      s.close();
    };
  }, [serverUrl, chess]);

  const createGame = async () => {
    const res = await fetch(`${serverUrl}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const game = await res.json();
    setGameId(game.id);
    socketRef.current?.emit('join', { gameId: game.id });
  };

  const sendMove = (m: Move) => {
    if (!gameId) return;
    socketRef.current?.emit('move', { gameId, move: m });
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Chess App</h2>
      <div style={{ marginBottom: 8 }}>Socket: {status}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <button onClick={createGame} disabled={!!gameId}>
            New Game
          </button>
          <div style={{ marginTop: 8 }}>Game ID: {gameId ?? '-'}</div>
          <div style={{ marginTop: 8 }}>
            Turn: {chess.turn() === 'w' ? 'White' : 'Black'}
          </div>
        </div>
        <Board chess={chess} onMove={sendMove} />
      </div>
    </div>
  );
}

export default App;
