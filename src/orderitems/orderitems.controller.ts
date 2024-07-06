import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put } from '@nestjs/common';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import { ResponseData } from 'src/global/globalClass';
import { Orderitem } from './entities/orderitem.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { OrderitemService } from './orderitems.service';

@Controller('orderitems')
export class OrderitemsController {
  constructor(private readonly orderitemsService: OrderitemService) {}

  @Post()
  async createOrderItem(@Body() createOrderitemDto: CreateOrderitemDto): Promise<Orderitem> {
    return this.orderitemsService.createOrderItem(createOrderitemDto);
  }

  @Get()
  async getOrderItems(): Promise<ResponseData<Orderitem[]>> {
    try {
      const orders = await this.orderitemsService.getAllOrderItems();
      console.log("orders: ",orders);
      
      return new ResponseData<Orderitem[]>(orders, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Orderitem[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailOrderItem(@Param('id') id: string): Promise<ResponseData<Orderitem>> {
    try {
      const book = await this.orderitemsService.detailOrderItem(id);
      return new ResponseData<Orderitem>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Orderitem>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateOrderItem(@Param('id') id: string, @Body(new ValidationPipe()) updateOrderItemDto: UpdateOrderitemDto): Promise<ResponseData<Orderitem>> {
    try {
      const book = await this.orderitemsService.updateOrderItem(id, updateOrderItemDto);
      return new ResponseData<Orderitem>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Orderitem>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteOrderItem(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.orderitemsService.deleteOrderItem(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
