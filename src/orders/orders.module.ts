import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';
import { ShippersModule } from 'src/shippers/shippers.module';
import { OrderitemsModule } from 'src/orderitems/orderitems.module';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order,Orderitem]),
    UserModule,
    ShippersModule,
    BooksModule,
    forwardRef(() => OrderitemsModule), // Use forwardRef here
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
