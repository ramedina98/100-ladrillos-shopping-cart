import { describe, it, expect, beforeAll } from 'vitest';

import User from '../../src/core/User.js';
import type { UserData } from '../../src/core/User.js';

describe('User Entity', () => {
  let userData: UserData;

  beforeAll(() => {
    userData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'example@email.com'
    };
  });

  it('should create a user successfully', () => {
    const user = new User(userData);

    expect(user.email).to.be.equal('example@email.com');
    expect(user.getName()).to.be.equal('Juan Pérez');
  });

  it('should return full name including secondLastName when provided', () => {
    const user = new User({
      ...userData,
      firstName: 'Juan',
      lastName: 'Pérez',
      secondLastName: 'Lopez'
    });

    expect(user.getName()).toBe('Juan Pérez Lopez');
  });

  it('should return full name without secondLastName if not provided', () => {
    const user = new User({
      ...userData,
      firstName: 'Juan',
      lastName: 'Pérez'
    });

    expect(user.getName()).toBe('Juan Pérez');
  });

  it('should ignore empty or whitespace-only secondLastName', () => {
    const user = new User({
      ...userData,
      firstName: 'Juan',
      lastName: 'Pérez',
      secondLastName: '   '
    });

    expect(user.getName()).toBe('Juan Pérez');
  });
});
