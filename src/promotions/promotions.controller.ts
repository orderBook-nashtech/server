import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';
import { PromotionService } from './promotions.service';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    return this.promotionService.createPromotion(createPromotionDto);
  }

  @Get()
  findAll(): Promise<Promotion[]> {
    return this.promotionService.getAllPromotions();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Promotion> {
    return this.promotionService.detailPromotion(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    return this.promotionService.updatePromotion(id, updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.promotionService.removePromotion(id);
  }
}
