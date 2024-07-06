import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { UserService } from 'src/user/user.service';
import { ShippersService } from 'src/shippers/shippers.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Book } from 'src/books/entities/book.entity';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Orderitem)
    private readonly orderItemRepository: Repository<Orderitem>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly userService: UserService,
    private readonly shipperService: ShippersService,
  ) { }

  async getOrders(
    userId?: string,
    status?: OrderStatus,
    skip = 0,
    take = 10,
  ): Promise<[Order[], number]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.book', 'book') // Ensure book details are included
      .leftJoinAndSelect('order.shipper', 'shipper');

    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    query.skip(skip).take(take);

    const [orders, total] = await query.getManyAndCount();
    return [orders, total];
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items, totalPrice, shipAddress, shippedDate, paymentMethod, status, orderDate, shipperId } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array cannot be empty');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const shipper = await this.shipperService.detailShipper(shipperId);

    const order = this.orderRepository.create({
      totalPrice,
      shipAddress,
      shippedDate,
      paymentMethod,
      status: OrderStatus.PENDING,
      orderDate,
      user,
      shipper,
      orderItems: [], // Initialize orderItems as an empty array
    });

    await this.orderRepository.save(order);

    for (const item of items) {
      const book = await this.bookRepository.findOne({ where: { bookId: item.bookId } });
      if (!book) {
        throw new NotFoundException(`Book with ID ${item.bookId} not found`);
      }
      const orderItem = this.orderItemRepository.create({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        order,
        book,
      });
      await this.orderItemRepository.save(orderItem);
      order.orderItems.push(orderItem); // Safe to push now since orderItems is initialized
    }

    return this.getOrderById(order.orderId);
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId },
        relations: ['user', 'orderItems', 'orderItems.book', 'shipper'],
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get order: ${error.message}`);
    }
  }

  async detailOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['user', 'orderItems', 'orderItems.book', 'shipper'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderRepository.preload({
        orderId: id,
        ...updateOrderDto,
      });
      console.log('Updating order with ID:', id); // Log order ID
      console.log('Update data:', updateOrderDto); // Log update data
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return await this.orderRepository.save(order);
    } catch (error) {
      console.error(`Error updating order: ${error.message}`);
      throw new InternalServerErrorException(`Failed to update order: ${error.message}`);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      // First, delete all related order items
      await this.orderItemRepository.delete({ order: { orderId: id } });

      // Then, delete the order itself
      const result = await this.orderRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete order: ${error.message}`);
    }
  }
}
