import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ItemsModule } from './items/item.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.vqolf.mongodb.net/todo?retryWrites=true&w=majority'),
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  //providers: [],
})
export class AppModule {}
