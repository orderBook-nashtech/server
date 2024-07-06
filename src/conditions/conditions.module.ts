import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { Book } from 'src/books/entities/book.entity';
import { Condition } from './entities/condition.entity';
import { ConditionService } from './conditions.service';
import { ConditionController } from './conditions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Condition, Promotion,Book])],
  providers: [ConditionService],
  controllers: [ConditionController],
  exports: [ConditionModule]
})
export class ConditionModule {}