import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CultiveService } from './cultive.service';
import { CreateCultiveDto } from './dto/create-cultive.dto';
import { UpdateCultiveDto } from './dto/update-cultive.dto';

@Controller('cultive')
export class CultiveController {
  constructor(private readonly cultiveService: CultiveService) {}

  @Get()
  async findAll() {
    return await this.cultiveService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.cultiveService.findOne(id);
  }

  @Post('/create-cultive')
  async createCultive(@Body() dto: CreateCultiveDto) {
    return await this.cultiveService.createCultive(dto);
  }

  @Put(':id')
  async updateCultive(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCultiveDto,
  ) {
    return await this.cultiveService.updateCultive(id, dto);
  }

  @Delete(':id')
  async deleteCultive(@Param('id', ParseIntPipe) id: number) {
    return await this.cultiveService.remove(id);
  }
}
