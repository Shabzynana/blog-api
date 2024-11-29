import { Comment } from '../../comment/entities/comment.entity';
// import { User } from '../../user/entitie/user.entity';

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


@Entity({ name: 'posts' })
export class Post extends AbstractBaseEntity {
    
  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE', // Ensures comments are deleted when a post is deleted
  })
  comments: Comment[];

  //   @ManyToOne(() => Category, (category) => category.posts)
//   category: Category;

//   @ManyToMany(() => Tag, (tag) => tag.posts)
//   @JoinTable()
//   tags: Tag[];
}
