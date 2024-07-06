import { PartialType } from '@nestjs/mapped-types';
import { Column } from 'typeorm';
import { CreateAboutDto } from './create-about.dto';

export class UpdateAboutDto extends PartialType(CreateAboutDto) {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;
}
