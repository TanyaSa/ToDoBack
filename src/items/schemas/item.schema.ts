import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop()
  title: string;

  @Prop()
  isCompleted: boolean;
  
}

export const ItemSchema = SchemaFactory.createForClass(Item);
