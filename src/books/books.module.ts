import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]),CategoriesModule,AuthorsModule],
  providers: [BooksService],
  controllers: [BooksController],
  exports: [TypeOrmModule,BooksService],
})
export class BooksModule { }
