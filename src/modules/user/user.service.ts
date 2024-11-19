import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entites/user.entity";

@Injectable({})
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async currentUser(userId: string) {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
          }

        return user
    }

    signin() {
        return {"msg": "signin lfg, we up"}
    }
    
}