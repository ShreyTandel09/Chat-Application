import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResponse } from './interfaces/user-response.interface';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async getAllUsers(): Promise<UsersResponse> {
    const resData = await this.usersService.getAllUsers();
    return { message: 'Users fetched successfully', data: resData };
  }

  @Get('me')
  getProfile(@GetUser() user: User) {
    return { message: 'Users fetched successfully', data: user };
  }
}
