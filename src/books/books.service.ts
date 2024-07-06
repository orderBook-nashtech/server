import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from 'src/authors/authors.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorService: AuthorsService,
    private readonly categoryService: CategoriesService,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    const category = await this.categoryService.detailCategory(createBookDto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${createBookDto.categoryId} not found`);
    }
    book.category = category;

    const author = await this.authorService.detailAuthor(createBookDto.authorId);
    if (!author) {
      throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
    }
    book.author = author;

    return this.bookRepository.save(book);
  }

  async getAllBooks(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['author', 'category', 'reviews', 'promotions', 'conditions'],
    });
  }

  async getBooks(page: number, limit: number, categories: string, authors: string, ratings: string): Promise<[Book[], number]> {
    const categoryIds = categories.split(',').filter(id => id);
    const authorIds = authors.split(',').filter(id => id);
    const ratingValues = ratings.split(',').filter(value => value);

    const query = this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.reviews', 'reviews')
      .leftJoinAndSelect('book.promotions', 'promotions')
      .leftJoinAndSelect('book.conditions', 'conditions')
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryIds.length > 0) {
      query.andWhere('book.categoryId IN (:...categoryIds)', { categoryIds });
    }

    if (authorIds.length > 0) {
      query.andWhere('book.authorId IN (:...authorIds)', { authorIds });
    }

    if (ratingValues.length > 0) {
      query.andWhere('book.rating IN (:...ratingValues)', { ratingValues });
    }

    const [books, total] = await query.getManyAndCount();
    return [books, total];
  }

  async detailBook(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { bookId: id },
      relations: ['author', 'category', 'reviews', 'promotions', 'conditions'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.preload({
      bookId: id,
      ...updateBookDto,
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.bookRepository.save(book);
    return this.bookRepository.findOne({
      where: { bookId: id },
      relations: ['author', 'category', 'reviews', 'promotions', 'conditions'],
    });
  }

  async deleteBook(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async searchBooks(searchTerm: string, page: number, limit: number): Promise<[Book[], number]> {
    const query = this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.reviews', 'reviews')
      .leftJoinAndSelect('book.promotions', 'promotions')
      .leftJoinAndSelect('book.conditions', 'conditions')
      .where('LOWER(book.title) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(book.description) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(author.authorName) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(category.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .skip((page - 1) * limit)
      .take(limit);

    const [books, total] = await query.getManyAndCount();
    return [books, total];
  }
}
