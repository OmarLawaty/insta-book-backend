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

  async getRecent() {
    // TODO: Implement pagination
    const posts = await this.repo.find({
      order: { createdAt: 'DESC' },
      relations: ['creator', 'likes', 'saves', 'image'],
    });

    return posts;
  }

  async save(id: number, user: User) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    const relation = this.repo
      .createQueryBuilder('post')
      .relation(Post, 'saves')
      .of(post);

    const alreadySaved = post.saves?.some(
      (savedUser) => savedUser.id === user.id,
    );
    if (alreadySaved) return await relation.remove(user.id);

    await relation.add(user.id);
  }

  async like(id: number, user: User) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    const relation = this.repo
      .createQueryBuilder('post')
      .relation(Post, 'likes')
      .of(post);

    const alreadyLiked = post.likes?.some(
      (likedUser) => likedUser.id === user.id,
    );
    if (alreadyLiked) return await relation.remove(user.id);

    await relation.add(user.id);
  }

  async update(id: number, updatedPost: Partial<CreatePostDTO>, user: User) {
    const post = await this.findOne(id);

    if (!post || post.creator.id !== user.id)
      throw new NotFoundException('Post not found');

    const image = await this.imageRepo.findOne({
      where: { publicId: updatedPost.imageId },
    });

    if (!image) throw new NotFoundException('Image not found');

    if (post.image?.id !== image.id && post.image)
      await this.cloudinaryService.deleteAndRemove(post.image.id);

    Object.assign(post, updatedPost, { image });

    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.image) await this.cloudinaryService.deleteAndRemove(post.image.id);

    return this.repo.remove(post);
  }
}
