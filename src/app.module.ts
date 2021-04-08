import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ItemsModule } from './items/item.module';
import { AuthModule } from './auth/auth.module';
import { AuthTokenMiddleware } from './auth/authToken.middleware';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.vqolf.mongodb.net/todo?retryWrites=true&w=majority'),
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes('*');
  }
}
