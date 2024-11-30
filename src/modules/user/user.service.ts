import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../post/entities/post.entity";
import { formatUser } from "./dto/response.dto";
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

    async followUser(followingId: string, user: User) {

        const userExist = await this.userRepository.findOne({ 
            where: { id: user.id }, 
            relations: ['following'], });
        const following = await this.userRepository.findOne({ where: { id: followingId } });
        if (!userExist) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        if (!following) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        if (!Array.isArray(userExist.following)) {
            userExist.following = [];
        }

        const isFollowing = userExist.following.some((follow) => follow.id === following.id);
        if (isFollowing) {
            throw new HttpException('User is already following.', HttpStatus.BAD_REQUEST);
        }

        userExist.following.push(following);
        await this.userRepository.save(userExist);

        return {
            message: 'User followed successfully'
        }
    }

    async unfollowUser(followingId: string, user: User) {

        const userExist = await this.userRepository.findOne({ 
            where: { id: user.id }, 
            relations: ['following'],});
        const following = await this.userRepository.findOne({ where: { id: followingId } });
        if (!userExist) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        if (!following) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        userExist.following = userExist.following.filter((follow) => follow.id !== following.id);
        await this.userRepository.save(userExist);
        return {
            message: 'User unfollowed successfully'
        }
    }

    async getFollowing(userId: string) {

        const userExist = await this.userRepository.findOne({ 
            where: { id: userId }, 
            relations: ["following"], });
        if (!userExist) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        const following = userExist.following.map((follow) => formatUser(follow));

        return following
    }

    async getFollowers(userId: string) {

        const userExist = await this.userRepository.findOne({ 
            where: { id: userId }, 
            relations: ["followers"], });
        if (!userExist) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        const followers = userExist.followers.map((follow) => formatUser(follow));

        return followers
    }

    async softDeleteUser(id: string, user: User) {

        const userExist = await this.userRepository.findOne({ where: { id } });
        if (!userExist){
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        if (userExist.id !== user.id) {
            throw new HttpException('You are not authorized to delete this user.', HttpStatus.UNAUTHORIZED);
        }

        await this.userRepository.softDelete({ id });
        return {
            message: 'User deleted successfully'
        }
    }
    
}