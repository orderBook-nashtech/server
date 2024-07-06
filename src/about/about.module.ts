import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  providers: [AboutService],
  controllers: [AboutController],
  exports: [AboutService],
})
export class AboutModule {}
