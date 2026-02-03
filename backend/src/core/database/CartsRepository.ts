import Cart from '../Cart.js';

interface CartsRepository {
  createActiveCartForUser(userId: string): Promise<Cart>;
  findActiveCartByUser(userId: string): Promise<Cart>
  save(cart: Cart): Promise<void>
}

export type { CartsRepository };
