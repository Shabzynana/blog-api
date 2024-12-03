import * as bcrypt from 'bcryptjs';
import { Post } from '../../post/entities/post.entity';
import {Comment } from '../../comment/entities/comment.entity';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';


@Entity({ name: 'users' })
export class User extends AbstractBaseEntity {

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  // @DeleteDateColumn({ nullable: true })
  // deletedAt?: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: "user_followers", // Name of the join table
    joinColumn: { name: "followerId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "followingId", referencedColumnName: "id" },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

}