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
    return this.togglePostUserRelation(id, user, 'saves');
  }

  async like(id: number, user: User) {
    return this.togglePostUserRelation(id, user, 'likes');
  }

  private async togglePostUserRelation(
    id: number,
    user: User,
    relationName: 'likes' | 'saves',
  ) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    const relation = this.repo
      .createQueryBuilder('post')
      .relation(Post, relationName)
      .of(post);

    const usersInRelation = post[relationName] ?? [];
    const alreadyInRelation = usersInRelation.some(
      (relationUser) => relationUser.id === user.id,
    );

    if (alreadyInRelation) {
      await relation.remove(user.id);

      return {
        ...post,
        [relationName]: usersInRelation.filter((u) => u.id !== user.id),
      };
    }

    await relation.add(user.id);

    return {
      ...post,
      [relationName]: [...usersInRelation, user],
    };
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

  async remove(id: number, user: User) {
    const post = await this.findOne(id);

    if (!post || post.creator.id !== user.id)
      throw new NotFoundException('Post not found');

    if (post.image) await this.cloudinaryService.deleteAndRemove(post.image.id);

    return this.repo.remove(post);
  }
}
