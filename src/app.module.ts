import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProjectsModule } from './projects/projects.module';
import { SubcontractorsModule } from './subcontractors/subcontractors.module';
import { JobQuotationsModule } from './job-quotations/job-quotations.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { QuotationsModule } from './quotations/quotations.module';
import { CertificatesModule } from './certificates/certificates.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'user123',
    //   password: 'pass123',
    //   database: 'mydatabase',
    //   autoLoadEntities: true,
    //   synchronize: true,
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
    QuotationsModule,
    CertificatesModule,
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
