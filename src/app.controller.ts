import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { BooksService } from './books/books.service';
import { UserService } from './user/user.service';
import { AuthorsService } from './authors/authors.service';
import { CategoriesService } from './categories/categories.service';
import { ShippersService } from './shippers/shippers.service';
import { ReviewsService } from './reviews/reviews.service';
import { OrdersService } from './orders/orders.service';
import { FilterUserDto } from './user/dto/filter-user.dto';
import { PromotionService } from './promotions/promotions.service';
import * as moment from 'moment';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly booksService: BooksService,
    private readonly usersService: UserService,
    private readonly authorsService: AuthorsService,
    private readonly categoriesService: CategoriesService,
    private readonly shippersService: ShippersService,
    private readonly promotionsService: PromotionService,
    private readonly reviewsService: ReviewsService,
    private readonly ordersService: OrdersService,
  ) { }

  @Get('user')
  getUser(): string {
    return this.appService.getHello();
  }

  @Get('page/user')
  @Render('user/index')
  async showUsers(@Query() query: FilterUserDto) {
    const users = await this.usersService.getUsers(query);
    return { users };
  }

  @Get('page/authors')
  @Render('authors/index')
  async showAuthors() {
    const authors = await this.authorsService.getAuthors();
    return { authors };
  }

  @Get('page/categories')
  @Render('categories/index')
  async showCategories() {
    const categories = await this.categoriesService.getCategories();
    return { categories };
  }

  @Get('page/books')
  @Render('books/index')
  async showBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('categories') categories: string = '',
    @Query('authors') authors: string = '',
    @Query('ratings') ratings: string = '',
    @Query('search') search: string = '',
  ) {
    let books;
    let total;

    if (search) {
      [books, total] = await this.booksService.searchBooks(search, page, limit);
    } else {
      [books, total] = await this.booksService.getBooks(page, limit, categories, authors, ratings);
    }

    const totalPages = Math.ceil(total / limit);
    return { books, total, page, limit, totalPages, search };
  }

  @Get('page/shippers')
  @Render('shippers/index')
  async showShippers() {
    const shippers = await this.shippersService.getShippers();
    return { shippers };
  }

  @Get('page/reviews')
  @Render('reviews/index')
  async showReviews() {
    const reviews = await this.reviewsService.getReviews();
    return { reviews };
  }

  @Get('page/promotions')
  @Render('promotions/index')
  async showPromotions() {
    const promotions = await this.promotionsService.getAllPromotions();
    const books = await this.booksService.getAllBooks();
    return { promotions, moment, books };
  }

  @Get('page/orders')
  @Render('orders/index')
  async showOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const [orders, total] = await this.ordersService.getOrders(undefined, undefined, (page - 1) * limit, limit);
    const totalPages = Math.ceil(total / limit);
    const shippers = await this.shippersService.getShippers();
    return { orders, shippers, page, limit, totalPages };
  }

  @Get('page/about/client')
  @Render('about/index')
  async renderContentClient() {
    return { layout: false };
  }

  @Get('page/about')
  @Render('about/index')
  async renderContent() { }
}
