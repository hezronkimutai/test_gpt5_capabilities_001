import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsString, MinLength } from 'class-validator';

class CreateUserDto {
  @IsString()
  @MinLength(2)
  username: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body.username);
  }
}
