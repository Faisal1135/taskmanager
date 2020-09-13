import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/auth_user.dto';
import { JwtPayload } from './dto/jwt.payload';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(userDto: UserDto): Promise<void> {
    return this.userRepository.signUp(userDto);
  }

  async signIn(userDto: UserDto): Promise<{ accesstoken: string }> {
    const username = await this.userRepository.signIn(userDto);

    if (!username) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const payload: JwtPayload = { username };
    const accesstoken = this.jwtService.sign(payload);

    return { accesstoken };
  }
}
