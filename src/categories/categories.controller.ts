import { Controller, Get, Post, Delete, Param, Body, ValidationPipe, Put, Render, HttpException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async createCategory(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto): Promise<ResponseData<Category>> {
    try {
      const category = await this.categoriesService.createCategory(createCategoryDto);
      return new ResponseData<Category>(category, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Category>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get()
  async getCategories(): Promise<ResponseData<Category[]>> {
    try {
      const categories = await this.categoriesService.getCategories();
      return new ResponseData<Category[]>(categories, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Category[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailCategory(@Param('id') id: string): Promise<ResponseData<Category>> {
    try {
      const category = await this.categoriesService.detailCategory(id);
      return new ResponseData<Category>(category, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Category>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string, 
    @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto
  ): Promise<ResponseData<Category>> {
    try {
      const category = await this.categoriesService.updateCategory(id, updateCategoryDto);
      return new ResponseData<Category>(category, HttpStatus.SUCCESS, 'Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error); // Add detailed logging
      throw new HttpException('Failed to update category', HttpStatus.ERROR);
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.categoriesService.deleteCategory(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
