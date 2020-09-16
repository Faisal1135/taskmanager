import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getCustomRepository } from 'typeorm';
import { AuthService } from './auth.service';
import { UserDto } from './dto/auth_user.dto';
import { GetUser } from './get-user.decorator';

import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) userDto: UserDto): Promise<void> {
    return this.authService.signUp(userDto);
  }

  @Post('signin')
  signin(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.signIn(userDto);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
    return user;
  }
}
