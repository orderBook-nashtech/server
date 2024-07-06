import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orderitem } from './entities/orderitem.entity';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import { Order } from '../orders/entities/order.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class OrderitemService {
  constructor(
    @InjectRepository(Orderitem)
    private readonly orderitemRepository: Repository<Orderitem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createOrderItem(createOrderitemDto: CreateOrderitemDto): Promise<Orderitem> {
    const order = await this.orderRepository.findOne({ where: { orderId: createOrderitemDto.orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${createOrderitemDto.orderId} not found`);
    }
  
    const book = await this.bookRepository.findOne({ where: { bookId: createOrderitemDto.bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${createOrderitemDto.bookId} not found`);
    }
  
    const orderitem = this.orderitemRepository.create({
      ...createOrderitemDto,
      order,
      book,
    });
    return await this.orderitemRepository.save(orderitem);
  }

  async getAllOrderItems(): Promise<Orderitem[]> {
    return await this.orderitemRepository.find({ relations: ['order','book'] });
  }

  async detailOrderItem(id: string): Promise<Orderitem> {
    const orderitem = await this.orderitemRepository.findOne({
      where: { orderItemId: id },
      relations: ['order', 'book'],
    });
    if (!orderitem) {
      throw new NotFoundException(`Orderitem with ID ${id} not found`);
    }
    return orderitem;
  }

  async updateOrderItem(id: string, updateOrderitemDto: UpdateOrderitemDto): Promise<Orderitem> {
    const orderitem = await this.orderitemRepository.preload({
      orderItemId: id,
      ...updateOrderitemDto,
    });
    if (!orderitem) {
      throw new NotFoundException(`Orderitem with ID ${id} not found`);
    }
    return await this.orderitemRepository.save(orderitem);
  }

  async deleteOrderItem(id: string): Promise<void> {
    const result = await this.orderitemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Orderitem with ID ${id} not found`);
    }
  }
}
