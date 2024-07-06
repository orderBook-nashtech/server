import { IsEmail } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    adminId: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({select: false})
    password: string;

    // @OneToMany(() => User, (user) => user.admin)
    // users: User[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
