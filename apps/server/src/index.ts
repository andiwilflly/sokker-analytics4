import { Elysia } from 'elysia';
import { UserSchema } from '@shared/schema';

const app = new Elysia()
  .get('/user', () => {
    return UserSchema.parse({ id: '1', name: 'Alice' });
  })
  .listen(3000);

console.log('🦊 Server running on http://localhost:3000');
