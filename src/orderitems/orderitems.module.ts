import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orderitem } from './entities/orderitem.entity';
import { OrderitemsController } from './orderitems.controller';
import { Book } from 'src/books/entities/book.entity';
import { BooksModule } from 'src/books/books.module';
import { OrdersModule } from 'src/orders/orders.module';
import { OrderitemService } from './orderitems.service';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orderitem, Book,Order]),
    BooksModule,
    forwardRef(() => OrdersModule),
  ],
  providers: [OrderitemService],
  controllers: [OrderitemsController],
  exports: [OrderitemService],
})
export class OrderitemsModule {}
