import { IsNotEmpty, IsEmail } from 'class-validator';
import { Admin } from 'src/admin/entities/admin.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: true, default: null })
  firstName: string;

  @Column({ nullable: true, default: null })
  lastName: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true, default: null })
  phoneNumber: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;


  @Column({ nullable: true })
  @IsNotEmpty()
  address: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // @ManyToOne(() => Admin, (admin) => admin.users)
  // @JoinColumn({ name: 'adminId' })
  // admin: Admin;

  @Column({ default: null, nullable: true })
  refresh_token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
