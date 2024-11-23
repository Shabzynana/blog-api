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
      message: 'Comment added successfully!',
      savedcomment: {
        id: savedcomment.id,
        content: savedcomment.content,
        created_at: savedcomment.created_at,
        author: `${fullUser.first_name} ${fullUser.last_name}`,
      },
    };

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

    const comments = allComment.map((comment) => {
      return {
        comment_id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        author: `${comment.author.first_name} ${comment.author.last_name}`,
      }
    })
    return {
      message: 'Comment added successfully!',
      comments
    }

  }

  async getSingleComment(id: string, user: User) {

    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { author: true },
    })
    if (!comment) {
      throw new HttpException("Comment Not Found",  HttpStatus.NOT_FOUND)
    }
    return {
      comment_id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      author: `${comment.author.first_name} ${comment.author.last_name}`,
    };
    
    
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
