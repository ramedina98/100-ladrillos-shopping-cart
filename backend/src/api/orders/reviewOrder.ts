import { Request, Response } from 'express';

import OrderPresenter from '../presenters/OrderPresenter.js';
import { OrderNotFound } from '../../core/database/errors/index.js';
import {
  InternalServerError,
  NotFound
} from '../errors/index.js';
import type { Database } from '../../core/database/index.js';
import type { Reporter } from '../../lib/errorReporter/index.js';

const reviewOrder = async (req: Request, res: Response) => {
  const database = req.app.get('database') as Database;
  const errorReporter = req.app.get('errorReporter') as Reporter;

  const { id } = req.body;

  try {
    const order = await database.orders.findById(id);

    res
      .status(200)
      .send(OrderPresenter.present(order));
  } catch (error) {
    if (error instanceof OrderNotFound) {
      throw new NotFound('ORDER_NOT_FOUND', { cause: error });
    }

    errorReporter.send(error);

    throw new InternalServerError({ cause: error });
  }
};

export default reviewOrder;
