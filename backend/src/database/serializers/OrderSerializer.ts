import { OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import Brick from '../../core/Brick.js';
import Order from '../../core/Order.js';
import User from '../../core/User.js';

interface UserDB {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  email: string;
}

interface OrderItemDB {
  id: string;
  brick: Brick;
  orderId: string;
  finalPrice: Decimal;
}

interface OrderDB {
  id: string;
  user: UserDB;
  status: OrderStatus;
  totalAmount: Decimal;
  termsAcceptedAt: Date | null;
  confirmedAt: Date | null;
  completedAt: Date | null;
  items: OrderItemDB[];
  createdAt: Date;
  updatedAt: Date;
}

class OrderSerializer {
  static deserialize(order: OrderDB): Order {
    const user = new User({
      ...order.user,
      secondLastName: order.user.secondLastName ?? undefined
    });

    return new Order({
      ...order,
      user,
      totalAmount: order.totalAmount.toNumber(),
      termsAcceptedAt: order.termsAcceptedAt ?? undefined,
      confirmedAt: order.confirmedAt ?? undefined,
      completedAt: order.completedAt ?? undefined,
      items: order.items.map(item => ({
        ...item,
        finalPrice: item.finalPrice.toNumber()
      }))
    });
  }
}

export default OrderSerializer;
