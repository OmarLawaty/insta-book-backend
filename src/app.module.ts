import cookieSession from 'cookie-session';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getDataSourceOptions } from 'datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { APP_PIPE } from '@nestjs/core';
import { RedisModule } from './redis.module';
import { CurrentUserMiddleware } from './users/middlewares';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(getDataSourceOptions()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')!],
        }),
      )
      .forRoutes('*');

    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
