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

interface UserDB {
  id: string;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CartDBData {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDB;
  items: CartItemsDB[];
}

class CartSerializer {
  static deserialize(cart: CartDBData): Cart {
    const user = new User({
      ...cart.user,
      secondLastName: cart.user.secondLastName ?? undefined
    });

    return new Cart({
      id: cart.id,
      user,
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
