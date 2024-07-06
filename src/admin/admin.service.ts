import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) { }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 12);
    const admin = this.adminRepository.create({ ...createAdminDto, password: hashedPassword });
    return this.adminRepository.save(admin);
  }

  async getAdmins(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async detailAdmin(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { adminId: id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 12);
    }
    const admin = await this.adminRepository.preload({ adminId: id, ...updateAdminDto });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return this.adminRepository.save(admin);
  }

  async deleteAdmin(id: string): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}
