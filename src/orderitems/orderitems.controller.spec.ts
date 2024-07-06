import { Test, TestingModule } from '@nestjs/testing';
import { OrderitemsController } from './orderitems.controller';
import { OrderitemService } from './orderitems.service';

describe('OrderitemsController', () => {
  let controller: OrderitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderitemsController],
      providers: [OrderitemService],
    }).compile();

    controller = module.get<OrderitemsController>(OrderitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
