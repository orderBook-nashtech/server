
import { MinLength } from "class-validator";

export class CategoryDto {
    category_id: number;
    @MinLength(5, { message: "This field must be than 5 characters" })
    name: string
    book_id: number
}