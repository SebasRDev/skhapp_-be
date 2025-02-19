import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { KitsService } from './kits.service';
import { CreateKitDto } from './dto/create-kit.dto';
import { UpdateKitDto } from './dto/update-kit.dto';

@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  @Post()
  create(@Body() createKitDto: CreateKitDto) {
    return this.kitsService.create(createKitDto);
  }

  @Get()
  findAll() {
    return this.kitsService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.kitsService.findOne(term);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateKitDto: UpdateKitDto) {
  //   return this.kitsService.update(id, updateKitDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kitsService.remove(id);
  }
}
