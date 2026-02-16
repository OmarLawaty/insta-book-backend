import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from 'src/guards';

@UseGuards(AuthGuard)
@Controller('media')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadAndSave(file);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: number) {
    return this.cloudinaryService.deleteAndRemove(id);
  }
}
