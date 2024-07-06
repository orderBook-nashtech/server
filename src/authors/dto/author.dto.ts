
import { MinLength } from "class-validator";

export class AuthorDto {
    // @IsNotEmpty()
    author_id: number;
    @MinLength(5, { message: "This field must be than 5 characters" })
    author_name: string;
    biography: string;
    book_id: number;
}