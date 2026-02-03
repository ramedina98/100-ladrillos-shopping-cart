import { Request, Response } from 'express';

import CartPresenter from '../presenters/CartPresenter.js';
import RemoveBrickCartService from '../../services/RemoveBrickCartService.js';
import { CartNotFound } from '../../core/database/errors/index.js';
import {
  InternalServerError,
  NotFound
} from '../errors/index.js';
import type { Database } from '../../core/database/index.js';
import type { Reporter } from '../../lib/errorReporter/index.js';

const removeBrick = async (req: Request, res: Response) => {
  const database = req.app.get('database') as Database;
  const errorReporter = req.app.get('errorReporter') as Reporter;

  const { userId, brickId } = req.body;

  const service = new RemoveBrickCartService(database);

  try {
    const cart = await service.execute(userId, brickId);

    res
      .status(200)
      .send(CartPresenter.present(cart));
  } catch (error) {
    if (error instanceof CartNotFound) {
      throw new NotFound('CART_NOT_FOUND', { cause: error });
    }

    errorReporter.send(error);

    throw new InternalServerError({ cause: error });
  }
};

export default removeBrick;
