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
import { CultiveService } from './cultive.service';
import { CreateCultiveDto } from './dto/create-cultive.dto';
import { UpdateCultiveDto } from './dto/update-cultive.dto';

@Controller('cultive')
export class CultiveController {
  constructor(private readonly cultiveService: CultiveService) {}

  @Get()
  findAll() {
    return this.cultiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultiveService.findOne(id);
  }

  @Post('/create-cultive')
  createCultive(@Body() dto: CreateCultiveDto) {
    return this.cultiveService.createCultive(dto);
  }

  @Put(':id')
  updateCultive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCultiveDto,
  ) {
    return this.cultiveService.updateCultive(id, dto);
  }

  @Delete(':id')
  deleteCultive(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultiveService.remove(id);
  }
}
