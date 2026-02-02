import DatabaseError from './DatabaseError.js';

class UserIsAlreadyRegistered extends DatabaseError {
  readonly email: string;

  constructor(email: string, options?: ErrorOptions) {
    super(`User with email ${email} is already registered`, options);

    this.email = email;
  }

}

export default UserIsAlreadyRegistered;
