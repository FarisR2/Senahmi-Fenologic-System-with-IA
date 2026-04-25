import { NotFoundException } from '@nestjs/common';

export class BaseService<T extends { id: string }> {
  protected items: T[] = [];

  findAll(): T[] {
    return this.items;
  }

  findOne(id: string): T {
    const item = this.items.find((c) => c.id === id);
    if (!item) throw new NotFoundException(`Resource with ID ${id} not found`);
    return item;
  }

  remove(id: string) {
    const item = this.findOne(id);
    this.items = this.items.filter((c) => c.id !== id);
    return {
      deleted: true,
      item,
    };
  }
}
