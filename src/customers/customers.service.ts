import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryDto } from 'src/paginations/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(query: QueryDto) {
    const { page, limit, search, sortBy, order } = query;

    const whereCondition = search
      ? [
          { name: Like(`%${search}%`) }, // Match number
          { email: Like(`%${search}%`) }, // Match email
          { contact: Like(`%${search}%`) },
        ]
      : [];

    const [data, total] = await this.customerRepository.findAndCount({
      where: whereCondition.length > 0 ? whereCondition : {}, // Apply OR condition if search exists
      order: { [sortBy]: order }, // Sorting
      skip: (page - 1) * limit, // Pagination start index
      take: limit, // Number of results per page
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findById(id);
    const updatedCustomer = Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(updatedCustomer);
  }

  async delete(id: number): Promise<void> {
    const customer = await this.findById(id);
    await this.customerRepository.remove(customer);
  }
}
