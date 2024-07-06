import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
}
