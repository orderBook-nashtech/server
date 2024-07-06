import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConditionDto } from './dto/create-condition.dto';
import { Condition } from './entities/condition.entity';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { Book } from 'src/books/entities/book.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>
  ) {}

  async createCondition(createConditionDto: CreateConditionDto): Promise<Condition> {
    const { bookId, promotionId, ...rest } = createConditionDto;

    const book = await this.bookRepository.findOne({ where: { bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const promotion = await this.promotionRepository.findOne({ where: { promotionId } });
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${promotionId} not found`);
    }

    const condition = this.conditionRepository.create({
      ...rest,
      book,
      promotion,
    });

    return this.conditionRepository.save(condition);
  }

  async getAllConditions(): Promise<Condition[]> {
    return this.conditionRepository.find({
      relations: ['book', 'promotion'],
    });
  }

  async detailCondition(id: string): Promise<Condition> {
    const condition = await this.conditionRepository.findOne({
      where: { conditionId: id },
      relations: ['book', 'promotion'],
    });
    if (!condition) {
      throw new NotFoundException(`Condition with ID ${id} not found`);
    }
    return condition;
  }

  async updateCondition(id: string, updateConditionDto: UpdateConditionDto): Promise<Condition> {
    const { bookId, promotionId, ...rest } = updateConditionDto;

    const condition = await this.conditionRepository.findOne({ where: { conditionId: id } });
    if (!condition) {
      throw new NotFoundException(`Condition with ID ${id} not found`);
    }

    if (bookId) {
      const book = await this.bookRepository.findOne({ where: { bookId } });
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found`);
      }
      condition.book = book;
    }

    if (promotionId) {
      const promotion = await this.promotionRepository.findOne({ where: { promotionId } });
      if (!promotion) {
        throw new NotFoundException(`Promotion with ID ${promotionId} not found`);
      }
      condition.promotion = promotion;
    }

    Object.assign(condition, rest);

    await this.conditionRepository.save(condition);
    return this.conditionRepository.findOne({
      where: { conditionId: id },
      relations: ['book', 'promotion'],
    });
  }

  async deleteCondition(id: string): Promise<void> {
    const result = await this.conditionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Condition with ID ${id} not found`);
    }
  }
}
