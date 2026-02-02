import DatabaseError from './DatabaseError.js';

class UserNotFound extends DatabaseError {
  readonly userId: string;

  constructor(userId: string, options?: ErrorOptions) {
    super(`User with id ${userId} not found`, options);

    this.userId = userId;
  }
}

export default UserNotFound;
