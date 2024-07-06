import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUsers(query:FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1
    const skip = (page - 1) * items_per_page
    const keyword = query.search || ''
     const [res,total] = await this.userRepository.findAndCount({
      where: [
        {firstName: Like('%'+ keyword + '%')},
        {lastName: Like('%' + keyword+'%')},
        {email: Like('%' + keyword+'%')},
      ],
      order: {createdAt: "DESC"},
      take: items_per_page,
      skip: skip,
      // relations: ['admin'],
    });
    const lastPage = Math.ceil(total/items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1
    const prevPage = page - 1 < 1 ? null : page - 1
    return {
      data: res,
      total,
      currentPage:page,
      nextPage,
      prevPage,
      lastPage
    }
  }

  async detailUser(id: string): Promise<User> {
    console.log('Querying user with ID:', id);  // Log the user ID being queried

    const user = await this.userRepository.findOne({ where: { userId: id } });
    console.log('Database user data:', user);  // Log the result of the database query

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOne(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({userId});
  
  }
  
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      userId: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // async updateAvatar(id: string, image: string): Promise<UpdateResult> {
  //   return this.userRepository.update(id, { image });
  // }
  async updateAvatar(id: string, image: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.image = image;
    return this.userRepository.save(user);
  }
}
