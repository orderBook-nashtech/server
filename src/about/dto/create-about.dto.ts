import { Column } from 'typeorm';

export class CreateAboutDto {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;
}
