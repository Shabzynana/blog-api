import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entites/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { formatUser } from '../user/dto/response.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {

    try {
      const userExists = await this.userRepository.findOne({ where: { email: createAuthDto.email } });
      if (userExists) {
        console.log('User already exists');
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.userRepository.create(createAuthDto);
      this.userRepository.save(newUser);

      return {
        message: 'User created successfully',
        data: formatUser(newUser)
      }
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 


  async signIn(dto: LoginDto) {

    const user =  await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const access_token = this.jwtService.sign({
      id: user.id,
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Logged in successfully',
      data: formatUser(user),
      access_token
    }
  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
