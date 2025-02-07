import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersResponse,
  SingleUserResponse,
} from './interfaces/user-response.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async getAllUsers(): Promise<UsersResponse> {
    const resData = await this.usersService.getAllUsers();
    return { message: 'Users fetched successfully', data: resData };
  }

  @Get('user-id')
  async getUserById(@Query('id') id: number): Promise<SingleUserResponse> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const resData = await this.usersService.findUserById(id);
    return { message: 'User fetched successfully', data: resData };
  }
}
