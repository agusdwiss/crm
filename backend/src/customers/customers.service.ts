import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerStatus } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) { }

  create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      status: createCustomerDto.status as CustomerStatus || CustomerStatus.ACTIVE,
    });
    return this.customersRepository.save(customer);
  }

  findAll() {
    return this.customersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.customersRepository.findOneBy({ id });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // TypeORM update tidak return object yang diupdate secara langsung
    // Jadi kita update dulu, lalu fetch ulang
    return this.customersRepository.update(id, updateCustomerDto).then(() => this.findOne(id));
  }

  remove(id: number) {
    return this.customersRepository.delete(id);
  }
}
