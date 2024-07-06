import { Test, TestingModule } from '@nestjs/testing';
import { ConditionController } from './conditions.controller';

describe('ConditionsController', () => {
  let controller: ConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionController],
    }).compile();

    controller = module.get<ConditionController>(ConditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
