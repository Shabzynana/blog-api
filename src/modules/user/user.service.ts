import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../post/entities/post.entity";
import { User } from "./entites/user.entity";

@Injectable({})
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async currentUser(userId: string) {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
          }

        return user
    }

    async allUserBlog(userId: string) {

        const userExist = await this.userRepository.findOne({ where: { id: userId } });
        if (!userExist) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        
        const blog = await this.postRepository.find({ where: { author: { id: userExist.id } } })
        if (!blog) {
            throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND);
        }
        return {
            blog   
        }
        
    }
    
}