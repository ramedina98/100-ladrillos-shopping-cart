import Brick from './Brick.js';

interface OrderItems {
  id?: string;
  orderId: string;
  brick: Brick;
  finalPrice: number;
}

export type { OrderItems };
