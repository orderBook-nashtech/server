import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Put, Render } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ResponseData } from 'src/global/globalClass';
import { Admin } from './entities/admin.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post()
  async createAdmin(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto): Promise<ResponseData<Admin>> {
    try {
      const author = await this.adminService.createAdmin(createAdminDto);
      return new ResponseData<Admin>(author, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Admin>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get()
  async getAdmins(): Promise<ResponseData<Admin[]>> {
    try {
      const admins = await this.adminService.getAdmins();
      return new ResponseData<Admin[]>(admins, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Admin[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async detailAdmin(@Param('id') id: string): Promise<ResponseData<Admin>> {
    try {
      const admin = await this.adminService.detailAdmin(id);
      return new ResponseData<Admin>(admin, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Admin>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body(new ValidationPipe()) updateAdminDto: UpdateAdminDto): Promise<ResponseData<Admin>> {
    try {
      const admin = await this.adminService.updateAdmin(id, updateAdminDto);
      return new ResponseData<Admin>(admin, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Admin>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.adminService.deleteAdmin(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
