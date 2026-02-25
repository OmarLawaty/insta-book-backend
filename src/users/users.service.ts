import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDTO } from 'src/auth/dtos';

import { User } from './user.entity';
import {
  buildCursorPaginationResult,
  CursorPaginationQuery,
  normalizeCursorPaginationQuery,
} from 'src/common';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(userCred: CreateUserDTO) {
    const user = this.repo.create(userCred);

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;

    return this.repo.findOne({
      where: { id },
      relations: ['posts', 'liked', 'saved', 'image'],
    });
  }

  async getUser(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      relations: [
        'image',
        'posts',
        'liked',
        'saved',
        'posts.creator',
        'posts.likes',
        'posts.saves',
        'liked.creator',
        'liked.likes',
        'liked.saves',
        'saved.creator',
        'saved.likes',
        'saved.saves',
      ],
    });

    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, updatedUser: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updatedUser);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return this.repo.remove(user);
  }

  async getTopUsers(limit: number) {
    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.image', 'image')
      .leftJoin('user.posts', 'post')
      .leftJoin('post.likes', 'likes')
      .addSelect('COUNT(likes.id)', 'likesCount')
      .groupBy('user.id')
      .addGroupBy('image.id')
      .orderBy('"likesCount"', 'DESC')
      .limit(limit);

    const { entities, raw } = await qb.getRawAndEntities();

    return entities.map((user, idx) => {
      const likesCount = Number(raw[idx]?.likesCount ?? 0);

      return Object.assign(user, { likesCount });
    });
  }

  async search(search?: string, query: CursorPaginationQuery = {}) {
    const normalizedSearch = search?.trim();

    if (!normalizedSearch)
      return { data: await this.getTopUsers(10), nextCursor: null };

    const { cursor, limit } = normalizeCursorPaginationQuery(query);

    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.image', 'image')
      .leftJoin('user.posts', 'post')
      .leftJoin('post.likes', 'likes')
      .addSelect('COUNT(likes.id)', 'likesCount')
      .where(
        'user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search',
        { search: `%${normalizedSearch}%` },
      )
      .groupBy('user.id')
      .addGroupBy('image.id')
      .orderBy('likesCount', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .take(limit + 1);

    if (cursor !== undefined) qb.andWhere('user.id < :cursor', { cursor });

    const { entities, raw } = await qb.getRawAndEntities();
    const usersWithLikes = entities.map((user, idx) =>
      Object.assign(user, { likesCount: Number(raw[idx]?.likesCount ?? 0) }),
    );

    return buildCursorPaginationResult(
      usersWithLikes,
      limit,
      (user) => user.id,
    );
  }
}
