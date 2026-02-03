import { Request, Response } from 'express';

import BrickCartService from '../../services/BrickCartService.js';
import CartPresenter from '../presenters/CartPresenter.js';
import { BrickNotFound } from '../../core/database/errors/index.js';
import { BrickAlreadyOwned } from '../../core/errors/index.js';
import {
  Conflict,
  InternalServerError,
  NotFound
} from '../errors/index.js';
import type { Database } from '../../core/database/index.js';
import type { Reporter } from '../../lib/errorReporter/index.js';

const addBrick = async (req: Request, res: Response) => {
  const database = req.app.get('database') as Database;
  const errorReporter = req.app.get('errorReporter') as Reporter;

  const service = new BrickCartService(database);

  const { brickId, userId } = req.body;

  try {
    const cart = await service.execute(userId, brickId);

    res
      .status(201)
      .send(CartPresenter.present(cart));
  } catch (error) {
    if (error instanceof BrickNotFound) {
      throw new NotFound('BRICK_NOT_FOUND', { cause: error });
    }

    if (error instanceof BrickAlreadyOwned) {
      throw new Conflict('BRICK_ALREADY_OWNED', { cause: error });
    }

    errorReporter.send(error);

    throw new InternalServerError({ cause: error });
  }
};

export default addBrick;
