import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<any> {
        const existingUser = await this.userRepository.findOne({ where: { email: registerUserDto.email } });
        if (existingUser) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await this.hashPassword(registerUserDto.password);
        const newUser = this.userRepository.create({
            ...registerUserDto,
            refresh_token: 'refresh_token_string',
            password: hashPassword,
        });

        await this.userRepository.save(newUser);
        return { message: 'Registration successful' };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
        if (!user) {
            throw new HttpException('Email does not exist', HttpStatus.UNAUTHORIZED);
        }
        // await new Promise(resolve => setTimeout(resolve,2000))
        const checkPassword = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!checkPassword) {
            throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED);
        }

        // Generate accessToken and refreshToken
        const payload = { id: user.userId, email: user.email };
        return this.generateToken(payload);
    }

    private async generateToken(payload: { id: string; email: string }) {
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });

        await this.userRepository.update({ email: payload.email }, { refresh_token: refreshToken });
        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('SECRET'),
            });
            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token: refreshToken });
            if (checkExistToken) {
                return this.generateToken({ id: verify.id, email: verify.email });
            } else {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
        }
    }
}