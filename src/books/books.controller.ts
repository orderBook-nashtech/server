import { Controller, Get, Post, Delete, Param, Body, ValidationPipe, Put, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  async createBook(@Body(new ValidationPipe()) createBookDto: CreateBookDto): Promise<ResponseData<Book>> {
    try {
      const book = await this.booksService.createBook(createBookDto);
      return new ResponseData<Book>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      console.error('Create Book Error:', error); // Log the error
      return new ResponseData<Book>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/image',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not uploaded');
    }
    const imageUrl = `http://localhost:3001/uploads/image/${file.filename}`;
    return { imageUrl };
  }

  @Get()
  async getBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categories') categories: string = '',
    @Query('authors') authors: string = '',
    @Query('ratings') ratings: string = ''
  ): Promise<ResponseData<{ books: Book[], total: number }>> {
    try {
      const [books, total] = await this.booksService.getBooks(page, limit, categories, authors, ratings);
      return new ResponseData<{ books: Book[], total: number }>({ books, total }, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<{ books: Book[], total: number }>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }


  @Get(':id')
  async detailBook(@Param('id') id: string): Promise<ResponseData<Book>> {
    try {
      const book = await this.booksService.detailBook(id);
      return new ResponseData<Book>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Book>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateBook(@Param('id') id: string, @Body(new ValidationPipe()) updateBookDto: UpdateBookDto): Promise<ResponseData<Book>> {
    try {
      const book = await this.booksService.updateBook(id, updateBookDto);
      return new ResponseData<Book>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Book>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.booksService.deleteBook(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
