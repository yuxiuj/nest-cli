import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Robot {
  @PrimaryGeneratedColumn({ comment: 'id' })
  id: number;

  /**
   * 机器人设人属性相关
   */
  @Column('varchar', { default: '', comment: '姓名' })
  name: string;

  @Column('varchar', { default: '', comment: '性别' })
  sex: string;

  @Column('varchar', { default: '', comment: '年龄' })
  age: string;

  @Column('varchar', { default: '', comment: '身高' })
  height: string;

  @Column('varchar', { default: '', comment: '体重' })
  weight: string;

  @Column('varchar', { default: '', comment: '属相' })
  zodiac: string;

  @Column('varchar', { default: '', comment: '星座' })
  constellation: string;

  @Column('varchar', { default: '', comment: '爸爸' })
  father: string;

  @Column('varchar', { default: '', comment: '妈妈' })
  mother: string;

  @Column('varchar', { default: '', comment: '家庭' })
  family: string;

  @Column('varchar', { default: '', comment: '家乡' })
  hometown: string;

  @Column('varchar', { default: '', comment: '地址' })
  address: string;

  @Column('varchar', { default: '', comment: '生日' })
  birthday: string;
}
