import BrickNotAvailable from '../core/errors/BrickNotAvailable.js';
import Cart from '../core/Cart.js';
import CartNotFound from '../core/database/errors/CartNotFound.js';
import Order from '../core/Order.js';
import { OrderNotFound } from '../core/database/errors/index.js';
import { Database } from '../core/database/Database.js';

import TermsNotAcceptedError from './errors/TermsNotAcceptedError.js';
import ServiceError from './errors/ServiceError.js';
import { Service } from './Service.js';

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

  async completeOrder(orderId: string): Promise<Order> {
    let order: Order;

    try {
      order = await this.database.orders.findById(orderId);

      order.confirmPurchase();
    } catch (error) {
      if (error instanceof OrderNotFound) {
        throw error;
      }

      throw new ServiceError({ cause: error });
    }

    for (const item of order.getItems()) {
      const brick = item.brick;

      try {
        brick.sold(order.user);

        await this.database.bricks.saveWithVersion(brick);
      } catch (error) {
        throw new ServiceError({ cause: error });
      }
    }

    order.complete();

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
