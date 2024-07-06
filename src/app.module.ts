import { Module, MiddlewareConsumer, NestModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LayoutMiddleware } from './middleware/layoutmiddleware';
import { UserModule } from './user/user.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderitemsModule } from './orderitems/orderitems.module';
import { AuthorsModule } from './authors/authors.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { ShippersModule } from './shippers/shippers.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Category } from './categories/entities/category.entity';
import { Review } from './reviews/entities/review.entity';
import { Order } from './orders/entities/order.entity';
import { Orderitem } from './orderitems/entities/orderitem.entity';
import { Promotion } from './promotions/entities/promotion.entity';
import { Admin } from './admin/entities/admin.entity';
import { Shipper } from './shippers/entities/shipper.entity';
import { AboutModule } from './about/about.module';
import { MailerModule } from './mailer/mailer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './payment/payment.module';
import { Author } from './authors/entities/author.entity';
import { Condition } from './conditions/entities/condition.entity';
import { ConditionModule } from './conditions/conditions.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '010102',
      database: 'orderbook',
      entities: [
        User, Author, Book, Category, Review, Order, Orderitem, Promotion, Shipper, Condition
      ],
      synchronize: true
    }),
    UserModule,
    BooksModule,
    CategoriesModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => OrderitemsModule),
    AuthorsModule,
    PromotionsModule, 
    ReviewsModule,
    ShippersModule,
    AuthModule,
    ConfigModule.forRoot(),
    AboutModule,
    MailerModule,
    PaymentModule,
    ConditionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LayoutMiddleware).forRoutes('*');
  }
}
