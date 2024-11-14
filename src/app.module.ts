import { Module } from '@nestjs/common';
import dataSource from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () => {
    //     await initializeDataSource(); // Ensure data source is initialized
    //     return dataSource.options;
    //   },
    // }),
    AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
