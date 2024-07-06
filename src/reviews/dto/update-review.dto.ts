import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    bookId: string;
    userId: string;
    rating?: number;
    comment?: string;
}
