import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {

    const book = await this.bookRepository.findOne({ where: { bookId: createReviewDto.bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${createReviewDto.bookId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { userId: createReviewDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${createReviewDto.userId} not found`);
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      book,
      user,
    });
    return this.reviewRepository.save(review);
  }

  async getReviews(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['book', 'user'] });
  }

  async detailReview(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { reviewId: id },
      relations: ['book', 'user'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.preload({
      reviewId: id,
      ...updateReviewDto,
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.reviewRepository.save(review);
  }

  async deleteReview(id: string): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
