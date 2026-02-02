import { describe, it, expect, beforeEach } from 'vitest';

import Order from '../../src/core/Order.js';
import User from '../../src/core/User.js';
import {
  InvalidState,
  OrderNotConfirmed,
  TermsNotAccepted
} from '../../src/core/errors/index.js';
import { OrderData } from '../../src/core/Order.js';

describe('Order Entity', () => {
  let baseOrderData: OrderData;

  beforeEach(() => {
    const user = new User({
      id: 'user-123',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com'
    });

    baseOrderData = {
      id: 'order-1',
      user,
      status: 'PENDING',
      items: [],
      totalAmount: 1000,
      createdAt: new Date()
    };
  });

  it('should create an order in PENDING state', () => {
    const order = new Order(baseOrderData);

    expect(order.getStatus()).to.be.equal('PENDING');
    expect(order.totalAmount).to.be.equal(1000);
    expect(order.getItems()).toEqual([]);
  });

  describe('acceptTerms', () => {
    it('should move order from PENDING to TERMS_ACCEPTED', () => {
      const order = new Order(baseOrderData);

      order.acceptTerms();

      expect(order.getStatus()).to.be.equal('TERMS_ACCEPTED');
    });

    it('should fail if state is not PENDING', () => {
      const order = new Order({ ...baseOrderData, status: 'CONFIRMED' });

      expect(() => order.acceptTerms()).toThrow(InvalidState);
    });
  });

  describe('confirmPurchase', () => {
    it('should move TERMS_ACCEPTED to CONFIRMED', () => {
      const order = new Order(baseOrderData);

      order.acceptTerms();
      order.confirmPurchase();

      expect(order.getStatus()).to.be.equal('CONFIRMED');
    });

    it('should fail if terms were not accepted', () => {
      const order = new Order(baseOrderData);

      expect(() => order.confirmPurchase()).toThrow(TermsNotAccepted);
    });
  });

  describe('complete', () => {
    it('should move CONFIRMED to COMPLETED', () => {
      const order = new Order(baseOrderData);

      order.acceptTerms();
      order.confirmPurchase();
      order.complete();

      expect(order.getStatus()).to.be.equal('COMPLETED');
    });

    it('should fail if order is not CONFIRMED', () => {
      const order = new Order(baseOrderData);

      expect(() => order.complete()).toThrow(OrderNotConfirmed);
    });
  });

  describe('fail', () => {
    it('should move any non-final state to FAILED', () => {
      const order = new Order(baseOrderData);

      order.fail();

      expect(order.getStatus()).to.be.equal('FAILED');
    });

    it('should not allow failing a COMPLETED order', () => {
      const order = new Order(baseOrderData);

      order.acceptTerms();
      order.confirmPurchase();
      order.complete();

      expect(() => order.fail()).toThrow(InvalidState);
    });
  });

  it('should follow the full valid purchase flow', () => {
    const order = new Order(baseOrderData);

    order.acceptTerms();
    order.confirmPurchase();
    order.complete();

    expect(order.getStatus()).to.be.equal('COMPLETED');
  });
});
