import Brick from './Brick.js';
import User from './User.js';
import { CartItem } from './CartItem.js';
import {
  BrickAlreadyInCart,
  BrickAlreadyOwned,
  BrickNotAvailableToAdd,
  CartEmpty,
  CartNotEditable
} from './errors/index.js';

type CartStatus = 'ACTIVE' | 'CHECKOUT_STARTED' | 'ABANDONED' | 'CONVERTED';

interface CartData {
  id: string;
  user: User;
  status: CartStatus;
  items?: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

class Cart {
  readonly id: string;
  readonly user: User;
  readonly createdAt: Date;

  private items: CartItem[];
  private status: CartStatus;
  private updatedAt: Date;

  constructor(data: CartData) {
    this.id = data.id;
    this.user = data.user;
    this.status = data.status;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? this.createdAt;

    this.items = data.items ?? [];
  }

  addBrick(brick: Brick) {
    if (this.status !== 'ACTIVE') {
      throw new CartNotEditable();
    }

    if (this.containsBrick(brick.id)) {
      throw new BrickAlreadyInCart(brick.id);
    }

    if (!brick.isAvailable()) {
      throw new BrickNotAvailableToAdd(brick.id, brick.getStatus());
    }

    const owner = brick.getCurrentOwner();

    if (owner && owner.id === this.user.id) {
      throw new BrickAlreadyOwned(brick.id);
    }

    this.items.push({
      cartId: this.id,
      brick,
      priceAtAddTime: brick.getPrice(),
      addedAt: new Date()
    });

    this.touch();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getStatus(): CartStatus {
    return this.status;
  }

  removeBrick(brickId: string) {
    if (this.status !== 'ACTIVE') {
      throw new CartNotEditable();
    }

    this.items = this.items.filter(item => item.brick.id !== brickId);
    this.touch();
  }

  startCheckout() {
    if (this.status !== 'ACTIVE') {
      throw new CartNotEditable();
    }

    if (this.items.length === 0) {
      throw new CartEmpty();
    }

    this.status = 'CHECKOUT_STARTED';
    this.touch();
  }

  totalAmount(): number {
    return this.items.reduce((sum, brick) => sum + brick.priceAtAddTime, 0);
  }

  containsBrick(brickId: string): boolean {
    return this.items.some(item => item.brick.id === brickId);
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}

export default Cart;
