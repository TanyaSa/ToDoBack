import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ItemController } from './items.controller';
import { ItemsService } from './items.service';
import { Item, ItemSchema } from './schemas/item.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    AuthModule
  ],
  controllers: [ItemController],
  providers: [
    ItemsService,
    AuthGuard,
    RolesGuard
  ],
})
export class ItemsModule { }