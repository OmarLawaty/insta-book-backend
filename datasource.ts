import { join } from 'path';
import { config } from 'dotenv';

import { User } from 'src/users/user.entity';
import { Post } from 'src/posts/post.entity';
import { Image } from 'src/cloudinary/image.entity';
import { DataSourceOptions, DataSource } from 'typeorm';

export const getDataSourceOptions = (): DataSourceOptions => {
  config({
    path: join(process.cwd(), `.env.${process.env.NODE_ENV ?? 'development'}`),
  });

  const migrations = [join(__dirname, 'migrations/*.{ts,js}')];

  const dataSourceOptions: Partial<DataSourceOptions> = {
    synchronize: false,
    migrations,
    entities: [User, Post, Image],
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dataSourceOptions, {
        type: 'sqlite',
        database: 'db.sqlite',
        synchronize: true,
      });
      break;
    case 'test':
      Object.assign(dataSourceOptions, {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        synchronize: true,
      });
      break;
    case 'production':
      if (!process.env.DATABASE_URL)
        throw new Error('DATABASE_URL is required in production');

      Object.assign(dataSourceOptions, {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        migrationsRun: true,
        ssl: { rejectUnauthorized: false },
      });
      break;
    default:
      throw new Error('Unknown environment');
  }

  return dataSourceOptions as DataSourceOptions;
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
