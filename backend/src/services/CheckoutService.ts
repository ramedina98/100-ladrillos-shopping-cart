import Cart from '../core/Cart.js';
import CartNotFound from '../core/database/errors/CartNotFound.js';
import Order from '../core/Order.js';
import TermsNotAcceptedError from './errors/TermsNotAcceptedError.js';
import ServiceError from './errors/ServiceError.js';
import { Database } from '../core/database/Database.js';

import { Service } from './Service.js';
import BrickNotAvailable from '../core/errors/BrickNotAvailable.js';

class CheckoutService implements Service {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async execute(userId: string, acceptTerms: boolean): Promise<Order> {
    let cart: Cart;

    if (!acceptTerms) {
      throw new TermsNotAcceptedError();
    }

    try {
      cart = await this.database.carts.findActiveCartByUser(userId);
    } catch (error) {
      if (error instanceof CartNotFound) {
        throw error;
      }

      throw new ServiceError({ cause: error });
    }

    cart.startCheckout();

    await this.reserveBricks(cart);

    const order = new Order({
      user: cart.user,
      status: 'PENDING',
      items: cart.getItems().map(item => ({
        orderId: item.cartId,
        brick: item.brick,
        finalPrice: item.priceAtAddTime
      })),
      totalAmount: cart.totalAmount(),
      createdAt: new Date()
    });

    order.acceptTerms();

    try {
      return await this.database.orders.save(order);
    } catch (error) {
      throw new ServiceError({ cause: error });
    }
  }

  private async reserveBricks(cart: Cart) {
    for (const item of cart.getItems()) {
      const brick = item.brick;

      try {
        brick.reserve();

        await this.database.bricks.saveWithVersion(brick);
      } catch (error) {
        if (error instanceof BrickNotAvailable) {
          throw error;
        }

        throw new ServiceError({ cause: error });
      }
    }
  }
}

export default CheckoutService;
