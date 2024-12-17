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
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    // private readonly configService: ConfigService,


  ) {}

  async signUp(createAuthDto: CreateAuthDto) {

    try {
      const userExists = await this.userRepository.findOne({ 
        where: { email: createAuthDto.email }, withDeleted: true });
      if (userExists) {
        if (userExists.deletedAt) {
          throw new HttpException(
            'Account associated with these email has been deleted. Please contact support for assistance',
            HttpStatus.NOT_FOUND
          )
        }
        console.log('User already exists');
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const hashPassword = await bcrypt.hash(createAuthDto.password, 10);
      createAuthDto.password = hashPassword

      const newUser = await this.userRepository.create(createAuthDto);
      this.userRepository.save(newUser);

      const token = this.jwtService.sign({
        id: newUser.id,
        email: newUser.email,
        sub: newUser.id,
      });

      const url = `${process.env.FRONTEND_URL}/confirm-email`
      await this.emailService.sendUserConfirmationMail(newUser.email, url, token, newUser.last_name);

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

    const user =  await this.userRepository.findOne({ 
      where: { email: dto.email }, withDeleted: true, 
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new HttpException(
        'Account associated with these email has been deleted. Please contact support for assistance', 
        HttpStatus.NOT_FOUND);
    }  

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentialsddd', HttpStatus.UNAUTHORIZED);
    }
    console.log(dto.password, user.password)

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


  async confirmEmail(token: string) {

    try {

      const decoded = this.jwtService.verify(token);
      console.log("decode", decoded)
      const userId = decoded.email;
      console.log("user id", userId)

      const userExist = await this.userRepository.findOne({ where: {email: userId}});
      console.log("userexisrt", userExist.id)
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      userExist.is_verified = true,
      userExist.is_verified_date = new Date()
      await this.userRepository.save(userExist);
      return {
        message: "Email verified successfully"
      }
    } catch (error) {
      const statusCode = error.status || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(error.message, statusCode);
    }
  }

  async resendConfirmEmail(userId: string) {

    const userExist = await this.userRepository.findOne({ where: {id: userId}});
    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userExist.is_verified) {
      throw new HttpException('Account is already confirmed', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({
      id: userExist.id,
      sub: userExist.id,
      email: userExist.email,
    });

    await this.emailService.sendUserConfirmationMail(userExist.email, `${process.env.FRONTEND_URL}/confirm-email`, token, userExist.last_name);
    return {
      message: "Please check your email to confirm your account",
    }
    
  }

  async forgotPassword(dto: forgotPasswordDto) {

    const userExist = await this.userRepository.findOne({ where: {email: dto.email}});
    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = this.jwtService.sign({
      id: userExist.id,
      sub: userExist.id,
      email: userExist.email,
    });

    await this.emailService.sendForgotPasswordMail(userExist.email, `${process.env.FRONTEND_URL}/reset-password`, token, userExist.last_name);
    return {
      message: "Please check your email to reset your password",
    }

  }

  async resetPassword(token: string, dto: ResetPasswordDto) {

    try {

      const decoded = this.jwtService.verify(token);
      console.log("decode", decoded)
      const userId = decoded.id;
      console.log("user id", userId)

      const userExist = await this.userRepository.findOne({ where: {id: userId}});
      console.log("userexisrt", userExist.id)
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (dto.new_password !== dto.confirm_password) {
        throw new HttpException('Password does not match', HttpStatus.BAD_REQUEST);
      }

      const hashPassword = await bcrypt.hash(dto.new_password, 10);
      userExist.password = hashPassword
      await this.userRepository.save(userExist);
      return {
        message: "Password reset successfully",
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }  



}
