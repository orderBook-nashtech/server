import { Controller, Get, Post, Delete, Param, Body, ValidationPipe, Put, Render } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()
  async createAuthor(@Body(new ValidationPipe()) createAuthorDto: CreateAuthorDto): Promise<ResponseData<Author>> {
    try {
      const author = await this.authorsService.createAuthor(createAuthorDto);
      return new ResponseData<Author>(author, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Author>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get()
  async getAuthors(): Promise<ResponseData<Author[]>> {
    try {
      const authors = await this.authorsService.getAuthors();
      return new ResponseData<Author[]>(authors, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Author[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailAuthor(@Param('id') id: string): Promise<ResponseData<Author>> {
    try {
      const author = await this.authorsService.detailAuthor(id);
      return new ResponseData<Author>(author, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Author>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateAuthor(@Param('id') id: string, @Body(new ValidationPipe()) updateAuthorDto: UpdateAuthorDto): Promise<ResponseData<Author>> {
    try {
      const author = await this.authorsService.updateAuthor(id, updateAuthorDto);
      return new ResponseData<Author>(author, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Author>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteAuthor(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.authorsService.deleteAuthor(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
