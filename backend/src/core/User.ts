interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private firstName: string;
  private lastName: string;
  private secondLastName?: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.secondLastName = data.secondLastName;
    this.email = data.email;

    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? this.createdAt;
  }

  getName(): string {
    return [this.firstName, this.lastName, this.secondLastName]
      .filter((name) => name && name.trim() !== '')
      .join(' ');
  }
}

export default User;
export type { UserData };
