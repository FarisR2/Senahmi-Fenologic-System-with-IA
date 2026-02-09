import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { FenologicService } from '../services/fenologic/fenologic.service';
import { CreateFenologicDto } from '../dto/fenologic/create-fenologic.dto';
import { UpdateFenologicDto } from '../dto/fenologic/update-fenologic.dto';

@Controller('fenologic')
export class FenologicController {
  constructor(private readonly fenologicService: FenologicService) {}

  @Get()
  findAll() {
    return this.fenologicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fenologicService.findOne(id);
  }

  @Post('/create-fenologic')
  createFenologic(@Body() dto: CreateFenologicDto) {
    return this.fenologicService.createFenologic(dto);
  }

  @Put(':id')
  updateFenologic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFenologicDto,
  ) {
    return this.fenologicService.updateFenologic(id, dto);
  }

  @Delete(':id')
  deleteFenologic(@Param('id', ParseUUIDPipe) id: string) {
    return this.fenologicService.remove(id);
  }
}
