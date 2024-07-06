// UpdateConditionDto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateConditionDto {
  @IsOptional()
  @IsNumber()
  limitProduct?: number;

  @IsOptional()
  @IsNumber()
  limitOrderValue?: number;

  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @IsString()
  promotionId?: string;
}