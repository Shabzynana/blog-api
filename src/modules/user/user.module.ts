import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { User } from './entites/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User, Post, Comment])],
    providers: [UserService],
})
export class UserModule {}
