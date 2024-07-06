
import { MinLength } from "class-validator";

export class PromotionDto {
    promotion_id: number;
    @MinLength(5, { message: "This field must be than 5 characters" })
    type: string
    book_id: number
}