import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProjectsModule } from './projects/projects.module';
import { SubcontractorsModule } from './subcontractors/subcontractors.module';
import { JobQuotationsModule } from './job-quotations/job-quotations.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { QuotationsModule } from './quotations/quotations.module';
import { CertificatesModule } from './certificates/certificates.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user123',
      password: 'pass123',
      database: 'mydatabase',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    CustomersModule,
    ProjectsModule,
    SubcontractorsModule,
    JobQuotationsModule,
    InvoicesModule,
    PurchaseOrdersModule,
    QuotationsModule,
    CertificatesModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
