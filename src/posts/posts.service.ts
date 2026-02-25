import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePostDTO } from './dtos';
import { User } from 'src/users';
import { CloudinaryService } from 'src/cloudinary';
import { Image } from 'src/cloudinary/image.entity';
import {
  buildCursorPaginationResult,
  CursorPaginationQuery,
  normalizeCursorPaginationQuery,
} from 'src/common';

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

  async search(search?: string, query: CursorPaginationQuery = {}) {
    const normalizedSearch = search?.trim();

    if (!normalizedSearch) return this.getRecent(query);

    const qb = this.createPostBaseQuery()
      .where('(post.caption LIKE :search OR post.tags LIKE :search)', {
        search: `%${normalizedSearch}%`,
      })
      .orderBy('post.updatedAt', 'DESC')
      .addOrderBy('post.id', 'DESC');

    return this.paginatePostsQuery(qb, query);
  }

  async getRecent(query: CursorPaginationQuery = {}) {
    const qb = this.createPostBaseQuery()
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC');

    return this.paginatePostsQuery(qb, query);
  }

  async getSaved(user: User, query: CursorPaginationQuery = {}) {
    const { cursor, limit } = normalizeCursorPaginationQuery(query);

    const qb = this.createPostBaseQuery()
      .innerJoin('post.saves', 'savedUser')
      .where('savedUser.id = :userId', { userId: user.id })
      .distinct(true)
      .orderBy('post.updatedAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit + 1);

    if (cursor !== undefined) qb.andWhere('post.id < :cursor', { cursor });

    const posts = await qb.getMany();

    return buildCursorPaginationResult(posts, limit, (post) => post.id);
  }

  async save(id: number, user: User) {
    return this.togglePostUserRelation(id, user, 'saves');
  }

  async like(id: number, user: User) {
    return this.togglePostUserRelation(id, user, 'likes');
  }

  private createPostBaseQuery() {
    return this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.creator', 'creator')
      .leftJoinAndSelect('creator.image', 'creatorImage')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.saves', 'saves')
      .leftJoinAndSelect('post.image', 'image');
  }

  private async paginatePostsQuery(
    qb: SelectQueryBuilder<Post>,
    query: CursorPaginationQuery,
  ) {
    const { cursor, limit } = normalizeCursorPaginationQuery(query);

    qb.take(limit + 1);

    if (cursor !== undefined) qb.andWhere('post.id < :cursor', { cursor });

    const posts = await qb.getMany();

    return buildCursorPaginationResult(posts, limit, (post) => post.id);
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

    if (post.image && post.image.id !== image.id)
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
