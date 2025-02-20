import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entites/user.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
