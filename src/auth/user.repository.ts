import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './dto/auth_user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userDto: UserDto): Promise<void> {
    const { username, password } = userDto;
    const salt = await bcrypt.genSalt();
    const user = new User();

    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username is already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(userDto: UserDto) {
    const { username, password } = userDto;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
