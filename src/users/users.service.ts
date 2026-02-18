import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDTO } from 'src/auth/dtos';

import { User } from './user.entity';

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
}
