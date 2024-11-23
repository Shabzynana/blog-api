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

    const savedBlog = await this.postRepository.save(blog);
    return {
      blog_id: savedBlog.id,
      title: savedBlog.title,
      content: savedBlog.content,
      author: `${fullUser.first_name} ${fullUser.last_name}`,
      created_at: savedBlog.created_at,
    };

  }

  async AllBlog() {

    const blog = await this.postRepository.find({
      relations: { author: true },
    })

    if (blog.length === 0) {
      throw new HttpException("Blog Not Found",  HttpStatus.NOT_FOUND)
    }
    
    const posts = blog.map((post) => {
      return {
        blog_id: post.id,
        title: post.title,
        content: post.content,
        author: `${post.author.first_name} ${post.author.last_name}`,
        created_at: post.created_at
      }
    })
    return posts

  }

  async getSingleBlog(id: string, user: User)  {

    // const blog = this.postRepository.findOne({
    //    where: { id, author: { id: user.id } } });
    const blog =  await this.postRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    console.log("blog", blog)
    if (!blog) {
      throw new HttpException("Blog Not Found",  HttpStatus.NOT_FOUND)
    }
    return {
      blog_id: blog.id,
      title: blog.title,
      content: blog.content,
      author: `${blog.author.first_name} ${blog.author.last_name}`,
      created_at: blog.created_at,
    };

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
    return {
      blog_id: updatedBlog.id,
      title: updatedBlog.title,
      content: updatedBlog.content,
      author: `${updatedBlog.author.first_name} ${updatedBlog.author.last_name}`,
      created_at: updatedBlog.created_at,
    };
      
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
