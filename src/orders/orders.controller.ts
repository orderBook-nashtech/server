import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  InternalServerErrorException,
  Res,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseData } from 'src/global/globalClass';
import { Order } from './entities/order.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Workbook } from 'exceljs';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<ResponseData<Order>> {
    try {
      const order = await this.ordersService.createOrder(createOrderDto);
      return new ResponseData<Order>(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ResponseData<{ orders: Order[]; total: number; totalPages: number }>> {
    try {
      const [orders, total] = await this.ordersService.getOrders(undefined, undefined, (page - 1) * limit, limit);
      const totalPages = Math.ceil(total / limit);
      return new ResponseData<{ orders: Order[]; total: number; totalPages: number }>(
        { orders, total, totalPages },
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<{ orders: Order[]; total: number; totalPages: number }>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get('excel')
  async exportExcel(@Res() res: Response): Promise<void> {
    try {
      const [orders] = await this.ordersService.getOrders();
      const workbook = new Workbook();
      const sheet = workbook.addWorksheet('Orders');

      sheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Order Date', key: 'orderDate', width: 20 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Ship Address', key: 'shipAddress', width: 30 },
        { header: 'Shipped Date', key: 'shippedDate', width: 20 },
        { header: 'Payment Method', key: 'paymentMethod', width: 20 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Products', key: 'orderitems', width: 30 },
      ];

      orders.forEach(order => {
        const productTitles = order.orderItems.map(item => item.book.title).join(', ');
        sheet.addRow({
          id: order.orderId,
          customerName: order.user.firstName + ' ' + order.user.lastName,
          orderDate: order.orderDate,
          totalAmount: order.totalPrice,
          shipAddress: order.shipAddress,
          shippedDate: order.shippedDate,
          paymentMethod: order.paymentMethod,
          userEmail: order.user ? order.user.email : 'No user information',
          orderitems: productTitles,
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      throw new InternalServerErrorException('Failed to export orders to Excel');
    }
  }

  @Get(':id')
  async detailOrder(@Param('id') id: string): Promise<ResponseData<Order>> {
    try {
      const order = await this.ordersService.detailOrder(id);
      return new ResponseData<Order>(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Order>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<ResponseData<Order>> {
    try {
      const order = await this.ordersService.updateOrder(id, updateOrderDto);
      return new ResponseData<Order>(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<ResponseData<null>> {
    try {
      await this.ordersService.deleteOrder(id);
      return new ResponseData<null>(null, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
