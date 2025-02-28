import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryDto } from 'src/paginations/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query: QueryDto) {
    const { page, limit, search, sortBy, order } = query;

    const [data, total] = await this.userRepository.findAndCount({
      where: search
        ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
        : {}, // Search by name and email
      order: { [sortBy]: order }, // Sorting
      skip: (page - 1) * limit, // Pagination start index
      take: limit, // Number of results per page
      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      //   role: true,
      //   createdAt: true,
      //   updatedAt: true,
      // },
    });

    return {
      data: data.map((user) => {
        const { password, ...result } = user;
        return result;
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // find one by email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new InternalServerErrorException(
        `Error creating user: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    // ✅ Remove password if empty
    console.log(' updateUserDto.password', updateUserDto.password);
    if (!updateUserDto.password || updateUserDto.password === '') {
      delete updateUserDto.password;
    } else {
      // ✅ Hash the new password if provided
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.findById(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
