import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProjectsModule } from './projects/projects.module';
import { SubcontractorsModule } from './subcontractors/subcontractors.module';
import { JobQuotationsModule } from './job-quotations/job-quotations.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { CertificatesModule } from './certificates/certificates.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: Number(process.env.DATABASE_PORT) || 3306,
    //   username: process.env.DATABASE_USER || 'root',
    //   password: process.env.DATABASE_PASSWORD || 'root',
    //   database: process.env.DATABASE_NAME || 'test',
    //   autoLoadEntities: true,
    //   synchronize: true, // ❗ ห้ามใช้ใน Production ควรใช้ Migration แทน
    // }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    CustomersModule,
    ProjectsModule,
    SubcontractorsModule,
    JobQuotationsModule,
    PurchaseOrdersModule,
    CertificatesModule,
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
