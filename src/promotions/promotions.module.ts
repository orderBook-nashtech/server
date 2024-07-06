import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { PromotionService } from './promotions.service';
import { PromotionController } from './promotions.controller';
import { Order } from 'src/orders/entities/order.entity';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Order, Orderitem])],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionsModule {}
