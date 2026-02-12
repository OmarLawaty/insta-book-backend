import { User } from 'src/users';
import { DataSourceOptions, DataSource } from 'typeorm';

export const getDataSourceOptions = (): DataSourceOptions => {
  const dataSourceOptions: Partial<DataSourceOptions> = {
    synchronize: false,
    migrations: ['./migrations/*.{ts,js}'],
    entities: [User],
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
      // TODO: Finish this
      break;
    case 'production':
      // TODO: Finish this
      break;
    default:
      throw new Error('Unknown environment');
  }

  return dataSourceOptions as DataSourceOptions;
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
