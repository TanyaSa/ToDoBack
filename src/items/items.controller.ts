import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import { CreateDto } from './item.dto';
import { ItemDTO } from './item.interface';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';


@Controller('rest/checklist')
@UseGuards(AuthGuard) //AuthGuard('jwt')
export class ItemController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  getAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findById(id);
  }

  @Post()
  addNewItem(@Body() createDto: CreateDto): Promise<Item> {
      const item = {
      title: createDto.title,
      isCompleted: createDto.isCompleted
    } as ItemDTO;
    return this.itemsService.create(item);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
  
  @Put(':id')
  updateItem(@Param('id') id: string, @Body() сreateDto: CreateDto): Promise<Item> { 
    const item = {
      title: сreateDto.title,
      isCompleted: сreateDto.isCompleted
    } as ItemDTO;
    return this.itemsService.update(item, id);
  }

}
