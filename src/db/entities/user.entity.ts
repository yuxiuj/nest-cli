import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class User {
  @ObjectIdColumn()
  @Transform((value) => value.toString(), { toPlainOnly: true })
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // @Exclude()
  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: number;

  // @Exclude()
  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: number;
}
