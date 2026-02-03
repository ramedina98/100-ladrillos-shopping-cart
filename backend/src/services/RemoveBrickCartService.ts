import Cart from '../core/Cart.js';
import { CartNotFound } from '../core/database/errors/index.js';
import type { Database } from '../core/database/Database.js';

import ServiceError from './errors/ServiceError.js';
import { Service } from './Service.js';

class RemoveBrickCartService implements Service {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async execute(userId: string, brickId: string): Promise<Cart> {
    try {
      const cart = await this.database.carts.findActiveCartByUser(userId);

      cart.removeBrick(brickId);

      await this.database.carts.save(cart);

      return cart;
    } catch (error) {
      if (error instanceof CartNotFound) {
        throw error;
      }

      throw new ServiceError({ cause: error });
    }
  }
}

export default RemoveBrickCartService;
