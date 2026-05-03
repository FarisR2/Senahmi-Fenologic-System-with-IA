import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';

export class BaseService<T extends { id: number }> {
  constructor(protected readonly repository: Repository<T>) { }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<T> {
    const item = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!item) throw new NotFoundException(`Resource with ID ${id} not found`);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return {
      deleted: true,
      item,
    };
  }
}
