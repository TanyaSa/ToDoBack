import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateDto } from './item.dto';
import { UserDocument, User } from '../auth/user.schema';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService
  ) { }

  async create(createDto: CreateDto, userId: string): Promise<Item> {
    const createdItem = new this.itemModel(createDto);
    const item = await createdItem.save();
    await this.authService.addItemToUser(userId, item.id);
    return item;
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findItemsByUserId(userId: string): Promise<ItemDocument[]> {
    const userDb = await this.userModel.findById(userId)
    const populatedUser = await userDb.populate('items').execPopulate();
    const getItemResponse = populatedUser.items as ItemDocument[];
    return getItemResponse;
  }

  async findById(id: string): Promise<Item> {
    return this.itemModel.findById(id).exec();
  }

  async remove(id: string): Promise<Item> {
    return this.itemModel.findByIdAndRemove(id);
  }

  async removeItemByUserId(id: string, userId: string): Promise<ItemDocument> {
    const items = await this.findItemsByUserId(userId);

    if (items.find(x => x._id == id)) {
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { items: id }
      }).exec();

      return this.itemModel.findByIdAndRemove(id,).exec();
    }

    throw new ForbiddenException();

  }


  async update(createDto: CreateDto, id: string): Promise<Item> {
    return this.itemModel.findByIdAndUpdate(id, createDto, { new: true });
  }

  async updateByUserId(createDto: CreateDto, id: string, userId: string): Promise<Item> {
    const items = await this.findItemsByUserId(userId);
    if (items.find(x => x._id == id)) {
      return this.itemModel.findByIdAndUpdate(id, createDto, { new: true });
    }
    throw new ForbiddenException();
  }

}
