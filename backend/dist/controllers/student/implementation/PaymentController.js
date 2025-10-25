'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.PaymentController = void 0;
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }
  createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { courseId, amount } = req.body;
        const userId = req.user.id;
        const { razorpayOrderId, currency, enrollmentId } = yield this.paymentService.createOrder(
          userId,
          courseId,
          amount,
        );
        res.status(statusCode_1.HttpStatus.CREATED).json({
          message: 'Order created successfully',
          data: {
            razorpayOrderId,
            amount,
            currency,
            enrollmentId,
          },
        });
      } catch (e) {
        // catch (error) {
        //   console.error('Create Order Error:', error);
        //   res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        // }
        const status =
          (e === null || e === void 0 ? void 0 : e.status) === 409
            ? 409
            : statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          (e === null || e === void 0 ? void 0 : e.status) === 409
            ? 'You already purchased this course'
            : errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
        res.status(status).json({ message });
      }
    });
  }
  verifyPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        yield this.paymentService.verifyAndUpdate(
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        );
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Payment verified and enrollment updated',
        });
      } catch (error) {
        console.error('Verify Payment Error:', error);
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  cancelPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { enrollmentId } = req.body;
        yield this.paymentService.cancelEnrollment(enrollmentId);
        res.status(statusCode_1.HttpStatus.OK).json({ status: 'cancelled' });
      } catch (err) {
        console.error('Cancel Payment Error:', err);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  getMyCourses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = req.user.id;
        const list = yield this.paymentService.getMyCourses(userId);
        res.json({ data: list });
      } catch (err) {
        console.error(err);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  getStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const userId = req.user.id;
      const stats = yield this.paymentService.getStats(userId);
      res.json({ data: stats });
    });
  }
  getHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = req.user.id;
        const list = yield this.paymentService.getPaymentHistory(userId);
        res.json({ data: list });
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  retryOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { enrollmentId } = req.body;
        if (!enrollmentId) {
          res.status(statusCode_1.HttpStatus.BAD_REQUEST).json({ message: 'Missing enrollmentId' });
          return;
        }
        const payload = yield this.paymentService.retryOrder(enrollmentId);
        res.json({ data: payload });
        return;
      } catch (err) {
        console.error(' retryOrder error:', err);
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
        return;
      }
    });
  }
}
exports.PaymentController = PaymentController;
