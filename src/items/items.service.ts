import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateDto } from './item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  async create(createDto: CreateDto): Promise<Item> {
    const createdItem = new this.itemModel(createDto);
    return createdItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findById(id: string): Promise<Item> {
    return this.itemModel.findById(id).exec();
  }

  async remove(id: string): Promise<Item> {
    return this.itemModel.findByIdAndRemove(id);
  }

  async update(createDto: CreateDto, id: string): Promise<Item> {
    return this.itemModel.findByIdAndUpdate(id, createDto, {new: true});
  }
}
