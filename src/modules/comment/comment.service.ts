import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entites/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}

  
  async addComment(postId: string, Dto: CreateCommentDto, user: User) {

    const fullUser = await this.userRepository.findOne({ where: { id: user.id} });
    const fullPost = await this.postRepository.findOne({ where: { id: postId} });

    if (!fullUser) {
      throw new HttpException("User Not Found",  HttpStatus.NOT_FOUND)
    }
    if (!fullPost) {
      throw new HttpException("Post Not Found",  HttpStatus.NOT_FOUND)
    }
    console.log('Post ID:', postId);
    console.log('Fetched Post:', fullPost);


    const comment = this.commentRepository.create({
      ...Dto,
      author: fullUser,
      post: fullPost
    });

    const savedcomment = await this.commentRepository.save(comment);
    return {
      savedcomment
    }

  }

  async findAllComment(postId: string, user: User) {

    const fullPost = await this.postRepository.findOne({ where: { id: postId} });
    if (!fullPost) {
      throw new HttpException("Post Not Found",  HttpStatus.NOT_FOUND)
    }

    const allComment = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: { author: true }
    })
    if (allComment.length === 0) {
      throw new HttpException("Comment Not Found",  HttpStatus.NOT_FOUND)
    }

    return allComment

  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
