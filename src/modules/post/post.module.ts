import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entites/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]),
  ],
  controllers: [PostController],
  providers: [PostService, Repository],
})
export class PostModule {}
