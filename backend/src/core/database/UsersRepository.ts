import User from '../User.js';

interface UserCreateData {
  email: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
}

interface UsersRepository {
  create(user: UserCreateData): Promise<User>;
  findById(id: string): Promise<User>;
}

export type { UserCreateData, UsersRepository };
