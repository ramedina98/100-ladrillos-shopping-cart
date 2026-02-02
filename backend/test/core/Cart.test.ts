import { beforeEach, describe, expect, it } from 'vitest';

import Address from '../../src/core/Address.js';
import Brick from '../../src/core/Brick.js';
import Cart from '../../src/core/Cart.js';
import Property from '../../src/core/Property.js';
import User from '../../src/core/User.js';

import {
  BrickAlreadyInCart,
  BrickNotAvailableToAdd,
  CartEmpty,
  CartNotEditable
} from '../../src/core/errors/index.js';

describe('Cart', () => {
  let cart: Cart;
  let brick: Brick;
  let property: Property;
  let user: User;

  beforeEach(() => {
    const address = new Address({
      street: 'Av. Reforma',
      exteriorNumber: '123',
      neighborhood: 'Centro',
      city: 'Ciudad de México',
      state: 'Jalisco',
      country: 'México',
      postalCode: '45290'
    });

    user = new User({
      id: 'user-123',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@email.com'
    });

    property = new Property({
      id: 'property-123',
      name: 'Corporate Tower',
      description: 'Office building',
      address,
      propertyType: 'OFFICE',
      totalBricks: 100,
      brickBasePrice: 1000,
      currency: 'MXN',
      fundingStatus: 'FUNDING',
      annualReturnTarget: 12,
      rentalYield: 8,
      appreciationTarget: 10,
      hasRentalPool: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    brick = new Brick({
      id: 'brick-1',
      property,
      status: 'AVAILABLE',
      ownershipPercentage: 0.01,
      accumulatedEarnings: 0,
      price: 1000,
      version: 1
    });

    cart = new Cart({
      id: 'cart-1',
      user,
      status: 'ACTIVE'
    });
  });

  describe('addBrick', () => {
    it('should add a brick to an active cart', () => {
      cart.addBrick(brick);

      expect(cart.getItems().length).to.be.equal(1);
      expect(cart.getItems()[0].brick).to.be.equal(brick);
      expect(cart.totalAmount()).to.be.equal(1000);
    });

    it('should do not allow adding when cart is not ACTIVE', () => {
      const nonEditableCart = new Cart({
        id: 'cart-2',
        user,
        status: 'CHECKOUT_STARTED'
      });

      expect(() => nonEditableCart.addBrick(brick)).toThrow(CartNotEditable);
    });

    it('should do not allow adding the same brick twice', () => {
      cart.addBrick(brick);

      expect(() => cart.addBrick(brick)).toThrow(BrickAlreadyInCart);
    });

    it('should do not allow adding a brick that is not available', () => {
      brick.reserve();

      expect(() => cart.addBrick(brick)).toThrow(BrickNotAvailableToAdd);
    });
  });

  describe('removeBrick', () => {
    it('should remove a brick from the cart', () => {
      cart.addBrick(brick);
      cart.removeBrick(brick.id!);

      expect(cart.getItems().length).to.be.equal(0);
      expect(cart.totalAmount()).to.be.equal(0);
    });

    it('should do not allow removing when cart is not ACTIVE', () => {
      const nonEditableCart = new Cart({
        id: 'cart-3',
        user,
        status: 'CHECKOUT_STARTED'
      });

      expect(() => nonEditableCart.removeBrick(brick.id)).toThrow(CartNotEditable);
    });
  });

  describe('startCheckout', () => {
    it('should move cart to CHECKOUT_STARTED when it has items', () => {
      cart.addBrick(brick);
      cart.startCheckout();

      expect(() => cart.addBrick(brick)).toThrow(CartNotEditable);
    });

    it('should do not allow checkout when cart is empty', () => {
      expect(() => cart.startCheckout()).toThrow(CartEmpty);
    });

    it('should do not allow checkout when cart is not ACTIVE', () => {
      const nonEditableCart = new Cart({
        id: 'cart-4',
        user,
        status: 'ABANDONED'
      });

      expect(() => nonEditableCart.startCheckout()).toThrow(CartNotEditable);
    });
  });

  describe('totalAmount', () => {
    it('should calculate total from all cart items', () => {
      const brick2 = new Brick({
        id: 'brick-2',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.02,
        accumulatedEarnings: 0,
        price: 500,
        version: 1
      });

      cart.addBrick(brick);
      cart.addBrick(brick2);

      expect(cart.totalAmount()).to.be.equal(1500);
    });
  });

  describe('containsBrick', () => {
    it('should return true when brick exists in cart', () => {
      cart.addBrick(brick);

      expect(cart.containsBrick(brick.id!)).to.be.equal(true);
    });

    it('should return false when brick is not in cart', () => {
      expect(cart.containsBrick('other-id')).to.be.equal(false);
    });
  });
});
