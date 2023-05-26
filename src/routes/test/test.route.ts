import express from 'express';
import apiResponse from '../../utilities/apiResponse';
import httpStatusCodes from 'http-status-codes';
import { getRepository } from 'typeorm';
import { User } from '../../entities/user/user.entity';

const router = express.Router();

const { celebrate, Joi, Segments } = require('celebrate');

/**
 * .required()
 */
router.get(
  '/getList',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string(),
    },
  }),
  async (req, res) => {
    let data = await getRepository(User).find(req.query);

    console.log(req.query, data, '测试');

    return apiResponse.result(res, { list: data }, httpStatusCodes.OK);
  },
);

export default router;
