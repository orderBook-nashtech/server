import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
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