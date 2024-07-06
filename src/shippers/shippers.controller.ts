import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ValidationPipe, Render } from '@nestjs/common';
import { ShippersService } from './shippers.service';
import { CreateShipperDto } from './dto/create-shipper.dto';
import { UpdateShipperDto } from './dto/update-shipper.dto';
import { ResponseData } from 'src/global/globalClass';
import { Shipper } from './entities/shipper.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) { }

  @Post()
  async createShipper(@Body(new ValidationPipe()) createShipperDto: CreateShipperDto): Promise<ResponseData<Shipper>> {
    try {
      const shipper = await this.shippersService.createShipper(createShipperDto);
      return new ResponseData<Shipper>(shipper, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Shipper>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get()
  async getShippers(): Promise<ResponseData<Shipper[]>> {
    try {
      const shippers = await this.shippersService.getShippers();
      return new ResponseData<Shipper[]>(shippers, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Shipper[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailOrder(@Param('id') id: string): Promise<ResponseData<Shipper>> {
    try {
      const book = await this.shippersService.detailShipper(id);
      return new ResponseData<Shipper>(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Shipper>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateBook(@Param('id') id: string, @Body(new ValidationPipe()) updateShipperDto: UpdateShipperDto): Promise<ResponseData<Shipper>> {
    try {
      const shipper = await this.shippersService.updateShipper(id, updateShipperDto);
      return new ResponseData<Shipper>(shipper, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Shipper>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteShipper(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.shippersService.deleteShipper(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
