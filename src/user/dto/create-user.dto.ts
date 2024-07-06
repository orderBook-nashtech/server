import { IsEmail, IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { Column } from "typeorm";

export class CreateUserDto {
    @IsString()
    @Column({ nullable: true })
    firstName: string;

    @IsString()
    @Column({ nullable: true })
    lastName: string;

    @IsString()
    @Column({ nullable: true })
    address: string;

    @IsString()
    @Column({ nullable: true })
    phoneNumber: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    isActive: boolean;

    @IsBoolean()
    isAdmin: boolean;

    @IsString()
    image: string;
}
