import { Book } from "src/books/entities/book.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    reviewId: string;

    @ManyToOne(() => Book, (book) => book.reviews, { eager: true })
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => User, (user) => user.reviews, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
