import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, Render, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException, Query, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { storageConfig } from '../config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterUserDto } from './dto/filter-user.dto';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService)
    { }

  @Post()
  // @UseGuards(AuthGuard)
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<ResponseData<User>> {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return new ResponseData<User>(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // @UseGuards(AuthGuard)
  // @UseGuards(new RoleGuard(['admin']))
  @Get()
  async getUsers(@Query() query: FilterUserDto): Promise<ResponseData<User[]>> {
    try {
      const users = await this.usersService.getUsers(query);
      return new ResponseData<User[]>(users, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async detailUser(@Param('id') id: string): Promise<ResponseData<User>> {
    try {
      const user = await this.usersService.detailUser(id);
      return new ResponseData<User>(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto): Promise<ResponseData<User>> {
    try {
      const user = await this.usersService.updateUser(id, updateUserDto);
      return new ResponseData<User>(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.usersService.deleteUser(id);
      return new ResponseData<boolean>(true, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(false, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req: any): Promise<ResponseData<User>> {
    // Log the entire user_data object to check its contents
    console.log('User data in request:', req.user_data);
  
    try {
      // Extract the user ID correctly
      const userId = req.user_data.id;
      console.log('User ID extracted from request:', userId);
  
      // Ensure we are querying the correct user ID
      const user = await this.usersService.findOne(userId);
      console.log('Retrieved user:', user);
  
      return new ResponseData<User>(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      console.error('Error retrieving user profile:', error.message);
      return new ResponseData<User>(null, HttpStatus.ERROR, error.message || HttpMessage.ERROR);
    }
  }
  


  @Post('upload-image')
  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', 
  {storage:storageConfig('image'),
    fileFilter:(req,file,cb)=>{
      const ext = extname(file.originalname)
      const allowedExtArr = ['.jpg','.png','.jpeg']
      if(!allowedExtArr.includes(ext)){
        req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr}`
        cb(null,false)
      }else{
        const fileSize = parseInt(req.headers['content-length'])
        if(fileSize > 1024 * 1024 * 5) {
          req.fileValidationError = `File is too large. Accept file size is less than 5MB`
          cb(null,false)
        }
        else {
          cb(null,true)
        }
      }
    }
  }
))
  uploadAvatar(@Req() req:any, @UploadedFile() file:Express.Multer.File){
    console.log("upload image: ",file);
    console.log("user data: ",req.user_data);
    if(req.fileValidationError){
      throw new BadRequestException(req.fileValidationError)
    }
    if(!file){
      throw new BadRequestException('File is required')
    }
    this.usersService.updateAvatar(req.user_data.id, file.fieldname+'/'+file.filename)
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/image',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not uploaded');
    }
    const imageUrl = `http://localhost:3001/uploads/image/${file.filename}`;
    return { imageUrl };
  }

}
