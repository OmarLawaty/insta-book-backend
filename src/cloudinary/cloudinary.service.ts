import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Image } from './image.entity';

@Injectable()
export class CloudinaryService {
  constructor(@InjectRepository(Image) private imageRepo: Repository<Image>) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'insta-book' },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
  }

  async uploadAndSave(file: Express.Multer.File) {
    const result = await this.uploadImage(file);

    const image = this.imageRepo.create({
      url: result.secure_url,
      publicId: result.public_id,
    });

    return this.imageRepo.save(image);
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    return cloudinary.uploader.destroy(publicId);
  }

  async deleteAndRemove(id: number) {
    const image = await this.imageRepo.findOneBy({ id });

    if (!image) throw new NotFoundException('Image not found');

    await this.deleteImage(image.publicId);

    return this.imageRepo.remove(image);
  }
}
