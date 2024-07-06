
import { MinLength, IsNumber } from "class-validator";

export class BookDto {
    // @IsNotEmpty()
    book_id: number;
    @MinLength(5, { message: "This field must be than 5 characters" })
    title: string;
    description: string;
    @IsNumber()
    price: number;
    discount: string;
    category_id: number;
    author_id: number
}