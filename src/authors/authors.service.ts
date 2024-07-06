import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) { }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async getAuthors(): Promise<Author[]> {
    return this.authorRepository.find({
      relations: ['books'] 
    });
  }

  async detailAuthor(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({ 
      where: { authorId: id },
      relations: ['books'] 
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.preload({
      authorId: id,
      ...updateAuthorDto,
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return this.authorRepository.save(author);
  }

  async deleteAuthor(id: string): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { authorId: id },
        relations: ['books']
    });

    if (!author) {
        throw new NotFoundException(`Author with ID ${id} not found`);
    }

    if (author.books.length > 0) {
        throw new Error('Cannot delete author because there are books associated with this author.');
    }

    await this.authorRepository.delete(id);
}
}
