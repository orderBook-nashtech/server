import { IsNotEmpty, IsString, Length } from "class-validator";
import { Book } from "src/books/entities/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    authorId: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    authorName: string;

    @Column()
    @IsString()
    @Length(10, 1000)
    biography: string;

    @OneToMany(() => Book, (book) => book.author)
    books: Book[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
