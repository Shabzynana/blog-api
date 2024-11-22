import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entites/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}



  async createPost(createPostDto: CreatePostDto, user: User) {


    const fullUser = await this.userRepository.findOne({ where: { id: user.id} });
    const blog = this.postRepository.create({
      ...createPostDto,
      author: fullUser,
    });

    const savedblog = await this.postRepository.save(blog);

    return savedblog;
  }

  async AllBlog() {

    const blog = await this.postRepository.find({
      relations: { author: true },
    })
    return blog

  }

  async getSingleBlog(id: string, user: User): Promise<Post>  {

    // const blog = this.postRepository.findOne({
    //    where: { id, author: { id: user.id } } });
    const blog =  await this.postRepository.findOne({
      where: { id }
    });
    console.log("blog", blog)
    if (!blog) {
      throw new HttpException("Blog Not Found",  HttpStatus.NOT_FOUND)
    }

    return blog

  }

  async updateBlog(id: string, updatePostDto: UpdatePostDto, user: User) {

    const blog = await this.postRepository.findOne({
      where: { id },
      relations: { author: true },
    })
    if (!blog) {
      throw new HttpException("Blog Not Found",  HttpStatus.NOT_FOUND)
    }
    if (blog.author.id !== user.id) {
      throw new HttpException("You are not authorized to update this blog",  HttpStatus.UNAUTHORIZED)
    }
    const updatedBlog = await this.postRepository.save({
      ...blog,
      ...updatePostDto
    })

    return updatedBlog
      
  }

   
  

  async deleteBlog(id: string, user: User) {

    const blog = await this.postRepository.findOne({
      where: {id},
      relations: { author: true },
    });
    if(!blog) {
      throw new HttpException("Blog Not Found",  HttpStatus.NOT_FOUND)
    }
    if (blog.author.id !== user.id) {
      throw new HttpException("You are not authorized to delete this blog",  HttpStatus.UNAUTHORIZED)
    }

    await this.postRepository.delete({id});
    return {
      message: "Blog deleted successfully"
    }

  }

}
