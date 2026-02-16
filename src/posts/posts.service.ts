import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos';
import { User } from 'src/users';
import { CloudinaryService } from 'src/cloudinary';
import { Image } from 'src/cloudinary/image.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repo: Repository<Post>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createPostDTO: CreatePostDTO, creator: User) {
    const image = await this.imageRepo.findOne({
      where: { publicId: createPostDTO.imageId },
    });

    if (!image) throw new NotFoundException('Image not found');

    const post = this.repo.create({
      ...createPostDTO,
      creator,
      image,
      likes: [],
      saves: [],
    });

    return this.repo.save(post);
  }

  findOne(id: number) {
    if (!id) return null;

    return this.repo.findOne({
      where: { id },
      relations: ['creator', 'likes', 'saves', 'image'],
    });
  }

  find(search: string) {
    return this.repo
      .createQueryBuilder('post')
      .where('post.caption LIKE :search', { search: `%${search}%` })
      .orWhere('post.tags LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async update(id: number, updatedPost: Partial<Post>) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    Object.assign(post, updatedPost);

    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.image) await this.cloudinaryService.deleteAndRemove(post.image.id);

    return this.repo.remove(post);
  }
}
