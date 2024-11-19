import { Module } from '@nestjs/common';
import dataSource from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'], // Specify custom .env files (optional)
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    AuthModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log('Database connection initialized');
  }
}
