import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { ConditionService } from './conditions.service';

@Controller('conditions')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @Post()
  async create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionService.createCondition(createConditionDto);
  }

  @Get()
  async findAll() {
    return this.conditionService.getAllConditions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conditionService.detailCondition(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConditionDto: UpdateConditionDto) {
    return this.conditionService.updateCondition(id, updateConditionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.conditionService.deleteCondition(id);
  }
}
