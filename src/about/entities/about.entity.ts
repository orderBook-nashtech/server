import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class About {
    @PrimaryGeneratedColumn('uuid')
    aboutId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
