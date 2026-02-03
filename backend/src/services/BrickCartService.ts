import Brick from '../core/Brick.js';
import Cart from '../core/Cart.js';
import { BrickAlreadyInCart, BrickAlreadyOwned } from '../core/errors/index.js';
import { BrickNotFound, CartNotFound } from '../core/database/errors/index.js';
import type { Database } from '../core/database/Database.js';

import ServiceError from './errors/ServiceError.js';
import { Service } from './Service.js';

class BrickCartService implements Service {
  readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async execute(userId: string, brickId: string): Promise<Cart> {
    let brick: Brick;
    let cart: Cart;

    try {
      brick = await this.database.bricks.findById(brickId);
    } catch (error) {
      if (error instanceof BrickNotFound) {
        throw error;
      }

      throw new ServiceError({ cause: error });
    }

    try {
      cart = await this.database.carts.findActiveCartByUser(userId);
    } catch (error) {
      if (error instanceof CartNotFound) {
        cart = await this.database.carts.createActiveCartForUser(userId);
      } else {
        throw new ServiceError({ cause: error });
      }
    }

    try {
      cart.addBrick(brick);

      await this.database.carts.save(cart);

      return cart;
    } catch (error) {
      if (error instanceof BrickAlreadyOwned || error instanceof BrickAlreadyInCart) {
        throw error;
      }

      throw new ServiceError({ cause: error });
    }
  }
};

export default BrickCartService;
