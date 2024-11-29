import { Post } from '../../post/entities/post.entity';
// import { User } from '../../user/entities/user.entity';

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
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { User } from 'src/modules/user/entites/user.entity';


@Entity({ name: 'comments' })
export class Comment extends AbstractBaseEntity {

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE', // Ensures the relation behaves consistently
  })
  post: Post;
}
