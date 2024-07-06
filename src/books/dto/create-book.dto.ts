import { IsString, IsNumber, IsBoolean, IsUUID } from 'class-validator';

export class CreateBookDto {
  title: string;

  description: string;

  unitPrice: number;

  isActive: boolean;

  rating: number;

  quantityInStock: number;

  bookImage: string;

  categoryId: string;

  authorId: string;

  onSale?: boolean;

  salePrice?: number;

  saleStartDate?: Date;

  saleEndDate?: Date;
}
