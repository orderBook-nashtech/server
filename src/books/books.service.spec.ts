import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { AuthorsService } from 'src/authors/authors.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockBookRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
});

const mockAuthorsService = {
  detailAuthor: jest.fn(),
};

const mockCategoriesService = {
  detailCategory: jest.fn(),
};

describe('BooksService', () => {
  let booksService: BooksService;
  let bookRepository;
  let authorsService;
  let categoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useFactory: mockBookRepository },
        { provide: AuthorsService, useValue: mockAuthorsService },
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    authorsService = module.get<AuthorsService>(AuthorsService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(booksService).toBeDefined();
  });

  describe('createBook', () => {
    it('should successfully create a book', async () => {
      const createBookDto = {
        title: 'Test Book',
        description: 'Test description',
        unitPrice: 100,
        isActive: true,
        rating: 5,
        quantityInStock: 10,
        bookImage: 'test-image.jpg',
        categoryId: '1',
        authorId: '1',
        onSale: false,
        salePrice: 90,
        saleStartDate: new Date(),
        saleEndDate: new Date(),
      };
      const savedBook = { ...createBookDto, id: '1' };
      categoriesService.detailCategory.mockResolvedValue({ id: '1' });
      authorsService.detailAuthor.mockResolvedValue({ id: '1' });
      bookRepository.create.mockReturnValue(createBookDto);
      bookRepository.save.mockResolvedValue(savedBook);

      const result = await booksService.createBook(createBookDto);

      expect(categoriesService.detailCategory).toHaveBeenCalledWith('1');
      expect(authorsService.detailAuthor).toHaveBeenCalledWith('1');
      expect(bookRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(bookRepository.save).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(savedBook);
    });
  });

  describe('getBooks', () => {
    it('should return books with pagination', async () => {
      const books = [{ id: '1', title: 'Test Book' }];
      const total = 1;
      bookRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([books, total]);

      const result = await booksService.getBooks(1, 10, '', '', '');

      expect(result).toEqual([books, total]);
    });
  });

  describe('detailBook', () => {
    it('should return a book by id', async () => {
      const book = { id: '1', title: 'Test Book' };
      bookRepository.findOne.mockResolvedValue(book);

      const result = await booksService.detailBook('1');

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { bookId: '1' },
        relations: ['author', 'category', 'reviews', 'promotions'],
      });
      expect(result).toEqual(book);
    });

    it('should throw a NotFoundException if book not found', async () => {
      bookRepository.findOne.mockResolvedValue(null);

      await expect(booksService.detailBook('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBook', () => {
    it('should update and return the book', async () => {
      const updateBookDto = {
        title: 'Updated Book',
        description: 'Updated description',
        unitPrice: 100,
        isActive: true,
        rating: 5,
        quantityInStock: 10,
        bookImage: 'updated-image.jpg',
        categoryId: '1',
        authorId: '1',
        onSale: false,
        salePrice: 90,
        saleStartDate: new Date(),
        saleEndDate: new Date(),
      };
      const updatedBook = { ...updateBookDto, id: '1' };
      bookRepository.preload.mockResolvedValue(updatedBook);
      bookRepository.save.mockResolvedValue(updatedBook);
      bookRepository.findOne.mockResolvedValue(updatedBook);

      const result = await booksService.updateBook('1', updateBookDto);

      expect(bookRepository.preload).toHaveBeenCalledWith({ bookId: '1', ...updateBookDto });
      expect(bookRepository.save).toHaveBeenCalledWith(updatedBook);
      expect(result).toEqual(updatedBook);
    });

    it('should throw a NotFoundException if book not found for update', async () => {
      bookRepository.preload.mockResolvedValue(null);

      await expect(booksService.updateBook('1', { title: 'Updated Book', description: 'Updated description', unitPrice: 100, isActive: true, rating: 5, quantityInStock: 10, bookImage: 'updated-image.jpg', categoryId: '1', authorId: '1', onSale: false, salePrice: 90, saleStartDate: new Date(), saleEndDate: new Date() })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBook', () => {
    it('should delete the book by id', async () => {
      bookRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(booksService.deleteBook('1')).resolves.not.toThrow();

      expect(bookRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if book not found for delete', async () => {
      bookRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(booksService.deleteBook('1')).rejects.toThrow(NotFoundException);
    });
  });
});

