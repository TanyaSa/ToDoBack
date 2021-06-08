import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateDto } from './item.dto';
import { ItemDTO } from './item.interface';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { VerifiedUserInterface } from '../auth/verified-user.interface';


@Controller('rest/checklist')
@UseGuards(AuthGuard, RolesGuard)
export class ItemController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  getAll(@Req() request: VerifiedUserInterface): Promise<Item[]> {
    if (request.user.role === Role.Admin) {
      return this.itemsService.findAll();
    }
    return this.itemsService.findItemsByUserId(request.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findById(id);
  }

  @Post()
  @Roles(Role.User)
  addNewItem(@Body() createDto: CreateDto, @Req() request: VerifiedUserInterface): Promise<Item> {
    const item = {
      title: createDto.title,
      isCompleted: createDto.isCompleted
    } as ItemDTO;
    return this.itemsService.create(item, request.user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteItem(@Param('id') id: string, @Req() request: VerifiedUserInterface): Promise<Item> {
    if (request.user.role === Role.Admin) {
      return this.itemsService.remove(id);
    }
    return this.itemsService.removeItemByUserId(id, request.user.id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.User)
  updateItem(@Param('id') id: string,
    @Body() сreateDto: CreateDto,
    @Req() request: VerifiedUserInterface): Promise<Item> {
    const item = {
      title: сreateDto.title,
      isCompleted: сreateDto.isCompleted
    } as ItemDTO;

    if (request.user.role == Role.Admin) {
      return this.itemsService.update(item, id);
    }
    return this.itemsService.updateByUserId(item, id, request.user.id);
  }

}
