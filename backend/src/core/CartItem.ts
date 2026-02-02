import Brick from './Brick.js';

interface CartItem {
  id?: string;
  cartId: string;
  brick: Brick;
  priceAtAddTime: number;
  addedAt: Date;
}

export type { CartItem };
