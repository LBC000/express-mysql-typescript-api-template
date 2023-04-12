import express from 'express';
import apiResponse from '../../utilities/apiResponse';
import httpStatusCodes from 'http-status-codes';

const router = express.Router();

const { celebrate, Joi, Segments } = require('celebrate');

/**
 * .required()
 */
router.get(
  '/getList',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().required(),
    },
  }),
  (req, res) => {
    console.log(req.query, '测试');
    return apiResponse.result(res, { a: '测试' }, httpStatusCodes.OK);
  },
);

export default router;
