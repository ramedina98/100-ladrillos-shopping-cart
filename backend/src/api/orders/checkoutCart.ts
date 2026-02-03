import { Request, Response } from 'express';

import CheckoutService from '../../services/CheckoutService.js';
import TermsNotAcceptedError from '../../services/errors/TermsNotAcceptedError.js';
import OrderPresenter from '../presenters/OrderPresenter.js';
import { CartNotFound } from '../../core/database/errors/index.js';
import {
  Conflict,
  InternalServerError,
  NotFound,
  UnprocessableEntity
} from '../errors/index.js';
import type { Database } from '../../core/database/index.js';
import type { Reporter } from '../../lib/errorReporter/index.js';
import BrickNotAvailable from '../../core/errors/BrickNotAvailable.js';

const checkoutCart = async (req: Request, res: Response) => {
  const database = req.app.get('database') as Database;
  const errorReporter = req.app.get('errorReporter') as Reporter;

  const { userId, acceptTerms } = req.body;

  const service = new CheckoutService(database);

  try {
    const order = await service.execute(userId, acceptTerms);

    res
      .status(200)
      .send(OrderPresenter.present(order));
  } catch (error) {
    if (error instanceof TermsNotAcceptedError) {
      throw new UnprocessableEntity('TERMS_NOT_ACCEPTED', { cause: error });
    }

    if (error instanceof CartNotFound) {
      throw new NotFound('CART_NOT_FOUND', { cause: error });
    }

    if (error instanceof BrickNotAvailable) {
      throw new Conflict('BRICK_NOT_AVAILABLE', { cause: error });
    }

    errorReporter.send(error);

    throw new InternalServerError({ cause: error });
  }
};

export default checkoutCart;
