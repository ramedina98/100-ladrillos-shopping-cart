import Order from '../Order.js';

interface OrdersRepository {
  findById(orderId: string): Promise<Order>;
  save(order: Order): Promise<Order>;
}

export type { OrdersRepository };
