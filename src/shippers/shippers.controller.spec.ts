import { Test, TestingModule } from '@nestjs/testing';
import { ShippersController } from './shippers.controller';
import { ShippersService } from './shippers.service';

describe('ShippersController', () => {
  let controller: ShippersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippersController],
      providers: [ShippersService],
    }).compile();

    controller = module.get<ShippersController>(ShippersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
