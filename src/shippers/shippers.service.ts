import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipperDto } from './dto/create-shipper.dto';
import { UpdateShipperDto } from './dto/update-shipper.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipper } from './entities/shipper.entity';

@Injectable()
export class ShippersService {
  constructor(
    @InjectRepository(Shipper)
    private readonly shipperRepository: Repository<Shipper>,
  ) { }

  async createShipper(createShipperDto: CreateShipperDto): Promise<Shipper> {
    const shipper = this.shipperRepository.create(createShipperDto);
    return this.shipperRepository.save(shipper);
  }

  async getShippers(): Promise<Shipper[]> {
    return this.shipperRepository.find();
  }


  async detailShipper(id: string): Promise<Shipper> {
    const shipper = await this.shipperRepository.findOne({ where: { shipperId: id } });
    if (!shipper) {
      throw new NotFoundException(`Shipper with ID ${id} not found`);
    }
    return shipper;
  }

  async updateShipper(id: string, updateShipperDto: UpdateShipperDto): Promise<Shipper> {
    const shipper = await this.shipperRepository.preload({
      shipperId: id,
      ...updateShipperDto,
    });
    if (!shipper) {
      throw new NotFoundException(`Shipper with ID ${id} not found`);
    }
    return this.shipperRepository.save(shipper);
  }

  async deleteShipper(id: string): Promise<void> {
    const result = await this.shipperRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shipper with ID ${id} not found`);
    }
  }
}
