import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Repository } from 'typeorm';
import { User } from '../user/entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import appConfig from '../../../config/auth.config';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    global: true,
    secret: appConfig().jwtSecret,
    signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
  }),
  EmailModule
],
  controllers: [AuthController],
  providers: [AuthService, EmailService, Repository],
})

export class AuthModule {}
