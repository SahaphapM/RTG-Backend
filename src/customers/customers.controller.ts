import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryDto } from 'src/paginations/pagination.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryDto) {
    console.log(query);
    const users = await this.customerService.findAll(query);
    console.log(users);
    return users;
  }

  @Get(':id')
  async getCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Customer> {
    return this.customerService.findById(id);
  }

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.customerService.delete(id);
  }
}
