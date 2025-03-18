import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [
        { first_name: ILike(`%${searchTerm}%`) },
        { last_name: ILike(`%${searchTerm}%`) },
      ],
    });
  }
}
