import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Res,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { QueryDto } from 'src/paginations/pagination.dto';

import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Response } from 'express'; // <-- ใช้จาก express
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryDto) {
    try {
      return await this.purchaseOrdersService.findAll(query);
    } catch (error) {}
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findById(id);
  }

  @Post()
  async create(
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  // ✅ 2️⃣ อัปโหลดไฟล์และอัปเดตชื่อไฟล์ของ Quotation
  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads/quotations';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const fileExt = path.extname(file.originalname);
          if (fileExt !== '.pdf') {
            return callback(
              new BadRequestException('Only PDF files are allowed!'),
              null,
            );
          }
          const newFileName = `${Date.now()}-${file.originalname}`;
          callback(null, newFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.includes('pdf')) {
          return callback(
            new BadRequestException('Only PDF files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadQuotationFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    try {
      // ตรวจสอบว่า Quotation มีอยู่จริงหรือไม่
      const purchaseOrder = await this.purchaseOrdersService.findById(id);
      if (!purchaseOrder) {
        throw new NotFoundException(`Quotation with id ${id} not found`);
      }

      // ลบไฟล์เก่าถ้ามี
      if (purchaseOrder.file) {
        const oldFilePath = path.join(
          process.cwd(),
          'uploads',
          'quotations',
          purchaseOrder.file,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // อัปเดตชื่อไฟล์ใหม่ในฐานข้อมูล
      await this.purchaseOrdersService.updateFile(id, file.filename);

      return {
        message: 'File uploaded and updated successfully with id: ' + id,
        filename: file.filename,
      };
    } catch (error) {
      console.error('Error uploading file:', error);

      // ลบไฟล์ที่อัปโหลดหากเกิดข้อผิดพลาด
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new InternalServerErrorException(
        `Error uploading file: ${error.message}`,
      );
    }
  }

  @Get('download/:filename')
  async downloadQuotation(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!filename) {
      throw new NotFoundException('Filename is required');
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      'quotations',
      filename,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        throw new NotFoundException('Error downloading file' + err.message);
      }
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const { message, file } = await this.purchaseOrdersService.remove(+id);

      if (!file) {
        throw new NotFoundException('No file associated with this certificate');
      }

      this.removefile(file);

      return { message };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing purchase order: ' + error.message,
      );
    }
  }

  removefile(file: string) {
    const filePath = path.join(process.cwd(), 'uploads', 'quotations', file);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Failed to delete file: ${error.message}`);
      }
    } else {
      console.warn(`File not found at ${filePath}, skipping deletion.`);
    }
  }
}
