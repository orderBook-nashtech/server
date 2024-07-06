import { IsString, IsDate, IsEnum, IsArray, IsUUID } from 'class-validator';
import { PromotionLevel } from '../entities/promotion.entity';

export class CreatePromotionDto {
  @IsString()
  code: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsEnum(PromotionLevel)
  level: PromotionLevel;

  conditionId: string

  @IsArray()
  productIds: number[];

  @IsUUID()
  orderId?: string;
}
