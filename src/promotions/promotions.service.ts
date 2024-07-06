import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Order } from 'src/orders/entities/order.entity';
import { Promotion } from './entities/promotion.entity';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async createPromotion(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = this.promotionsRepository.create(createPromotionDto);

    if (createPromotionDto.orderId) {
      const order = await this.ordersRepository.findOne({
        where: { orderId: createPromotionDto.orderId }
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${createPromotionDto.orderId} not found`);
      }
      promotion.order = order;
    }

    return this.promotionsRepository.save(promotion);
  }

  getAllPromotions(): Promise<Promotion[]> {
    return this.promotionsRepository.find({ relations: ['order'] });
  }

  async detailPromotion(id: string): Promise<Promotion> {
    const promotion = await this.promotionsRepository.findOne({
      where: { promotionId: id },
      relations: ['order']
    });
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async updatePromotion(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.promotionsRepository.preload({
       promotionId: id,
      ...updatePromotionDto,
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    if (updatePromotionDto.orderId) {
      const order = await this.ordersRepository.findOne({
        where: { orderId: updatePromotionDto.orderId }
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${updatePromotionDto.orderId} not found`);
      }
      promotion.order = order;
    }

    return this.promotionsRepository.save(promotion);
  }

  async removePromotion(id: string): Promise<void> {
    const promotion = await this.promotionsRepository.findOne({
      where: { promotionId: id },
      relations: ['order'],
    });
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    await this.promotionsRepository.remove(promotion);
  }
}
