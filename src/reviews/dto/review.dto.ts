
import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min, MinLength } from "class-validator";

export class ReviewDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    book_id: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    user_id: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating must be at most 5" })
    rating: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(5, { message: "Comment must be at least 5 characters long" })
    comment: string;
}