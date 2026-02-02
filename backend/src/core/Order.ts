import User from './User.js';

import { InvalidState, OrderNotConfirmed, TermsNotAccepted } from './errors/index.js';
import type { OrderItems } from './OrderItems.js';

type OrderStatus = 'PENDING' | 'TERMS_ACCEPTED' | 'CONFIRMED' | 'COMPLETED' | 'FAILED';

interface OrderData {
  id: string;
  user: User;
  status: OrderStatus;
  items: OrderItems[];
  totalAmount: number;
  termsAcceptedAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

class Order {
  readonly id: string;
  readonly user: User;
  readonly totalAmount: number;
  readonly createdAt: Date;

  private confirmedAt?: Date;
  private completedAt?: Date;
  private items: OrderItems[];
  private termsAcceptedAt?: Date;
  private status: OrderStatus;

  constructor(data: OrderData) {
    this.id = data.id;
    this.user = data.user;
    this.status = data.status;
    this.items = data.items;
    this.totalAmount = data.totalAmount;
    this.termsAcceptedAt = data.termsAcceptedAt;
    this.confirmedAt = data.confirmedAt;
    this.completedAt = data.completedAt;
    this.createdAt = data.createdAt;
  }

  acceptTerms() {
    if (this.status !== 'PENDING') {
      throw new InvalidState(this.status);
    }

    this.status = 'TERMS_ACCEPTED';
    this.termsAcceptedAt = new Date();
  }

  confirmPurchase() {
    if (this.status !== 'TERMS_ACCEPTED') {
      throw new TermsNotAccepted(this.status);
    }

    this.status = 'CONFIRMED';
    this.confirmedAt = new Date();
  }

  complete() {
    if (this.status !== 'CONFIRMED') {
      throw new OrderNotConfirmed(this.status);
    }

    this.status = 'COMPLETED';
    this.completedAt = new Date();
  }

  fail() {
    if (this.status === 'COMPLETED' || this.status === 'FAILED') {
      throw new InvalidState(this.status);
    }

    this.status = 'FAILED';
  }

  getItems(): OrderItems[] {
    return this.items;
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}

export default Order;
export type { OrderData, OrderStatus };
