import { Controller, Get, Post, Delete, Param, Body, ValidationPipe, Put, Render } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  async createReview(@Body(new ValidationPipe()) createReviewDto: CreateReviewDto): Promise<ResponseData<Review>> {
    try {
      const review = await this.reviewsService.createReview(createReviewDto);
      return new ResponseData<Review>(review, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Review>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get()
  async getReviews(): Promise<ResponseData<Review[]>> {
    try {
      const reviews = await this.reviewsService.getReviews();
      return new ResponseData<Review[]>(reviews, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Review[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailReview(@Param('id') id: string): Promise<ResponseData<Review>> {
    try {
      const review = await this.reviewsService.detailReview(id);
      return new ResponseData<Review>(review, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Review>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateReview(@Param('id') id: string, @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto): Promise<ResponseData<Review>> {
    try {
      const review = await this.reviewsService.updateReview(id, updateReviewDto);
      return new ResponseData<Review>(review, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Review>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.reviewsService.deleteReview(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
