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
import { FenologicService } from './fenologic.service';
import { CreateFenologicDto } from './dto/create-fenologic.dto';
import { UpdateFenologicDto } from './dto/update-fenologic.dto';

@Controller('fenologic')
export class FenologicController {
  constructor(private readonly fenologicService: FenologicService) {}

  @Get()
  async findAll() {
    return await this.fenologicService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.fenologicService.findOne(id);
  }

  @Post('/create-fenologic')
  async createFenologic(@Body() dto: CreateFenologicDto) {
    return await this.fenologicService.createFenologic(dto);
  }

  @Put(':id')
  async updateFenologic(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFenologicDto,
  ) {
    return await this.fenologicService.updateFenologic(id, dto);
  }

  @Delete(':id')
  async deleteFenologic(@Param('id', ParseIntPipe) id: number) {
    return await this.fenologicService.remove(id);
  }
}
