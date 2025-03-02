import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Res,
  InternalServerErrorException,
  Put,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Response } from 'express'; // <-- ใช้จาก express
import { QueryDto } from 'src/paginations/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}
  // ✅ 1️⃣ สร้าง Certificate โดยยังไม่มีไฟล์
  @Post()
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    try {
      const certificate =
        await this.certificatesService.create(createCertificateDto);
      return certificate;
    } catch (error) {
      console.error('Error creating certificate:', error);
      throw new InternalServerErrorException(
        `Error creating certificate: ${error.message}`,
      );
    }
  }

  // ✅ 2️⃣ อัปโหลดไฟล์และอัปเดตชื่อไฟล์ของ Certificate
  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads/certificates';
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
  async uploadCertificateFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Uploading file for certificate ID:', id);

    if (!file) {
      throw new BadRequestException('File is required!');
    }

    try {
      // ตรวจสอบว่า Certificate มีอยู่จริงหรือไม่
      const certificate = await this.certificatesService.findOne(id);
      if (!certificate) {
        throw new NotFoundException(`Certificate with id ${id} not found`);
      }

      // ลบไฟล์เก่าถ้ามี
      if (certificate.file) {
        const oldFilePath = path.join(
          process.cwd(),
          'uploads',
          'certificates',
          certificate.file,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${certificate.file}`);
        }
      }

      // อัปเดตชื่อไฟล์ใหม่ในฐานข้อมูล
      await this.certificatesService.updateFile(id, file.filename);

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
  async downloadCertificate(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!filename) {
      throw new NotFoundException('Filename is required');
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      'certificates',
      filename,
    );
    console.log('File path:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        throw new NotFoundException('Error downloading file' + err.message);
      }
    });
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryDto) {
    return await this.certificatesService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificatesService.update(+id, updateCertificateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const { message, file } = await this.certificatesService.remove(+id);

      if (!file) {
        throw new NotFoundException('No file associated with this certificate');
      }

      this.removefile(file);

      return { message };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing certificate: ' + error.message,
      );
    }
  }

  removefile(file: string) {
    const filePath = path.join(process.cwd(), 'uploads', 'certificates', file);
    console.log('Resolved File Path:', filePath);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`File ${file} deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete file: ${error.message}`);
      }
    } else {
      console.warn(`File not found at ${filePath}, skipping deletion.`);
    }
  }
}
