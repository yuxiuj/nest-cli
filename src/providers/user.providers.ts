import { Connection } from 'mongoose';
import { userSchema } from '../schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('Users', userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
