import { CartStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import Brick from '../../core/Brick.js';
import Cart from '../../core/Cart.js';
import User from '../../core/User.js';

interface CartItemsDB {
  id: string;
  cartId: string;
  brick: Brick;
  priceAtAddTime: Decimal;
  addedAt: Date;
}

interface CartDBData {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemsDB[];
}

class CartSerializer {
  static deserialize(cart: CartDBData, user: User): Cart {
    return new Cart({
      id: cart.id,
      user: user,
      status: cart.status as CartStatus,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items.map(item => ({
        ...item,
        priceAtAddTime: item.priceAtAddTime.toNumber()
      }))
    });
  }
}

export default CartSerializer;
