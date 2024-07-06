import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateConditionDto {
  @IsNumber()
  limitProduct: number;

  @IsNumber()
  limitOrderValue: number;

  @IsString()
  bookId: string;

  @IsString()
  promotionId: string;
}