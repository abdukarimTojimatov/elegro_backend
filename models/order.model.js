import mongoose from 'mongoose';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderAutoNumber: { type: String, required: false, unique: true },
    orderName: {
      type: String,
      required: true,
    },
    orderCustomerName: {
      type: String,
      required: true,
    },
    orderCustomerPhoneNumber: {
      type: String,
      required: false,
      default: null,
    },
    orderDescription: {
      type: String,
      required: false,
    },
    orderCategory: {
      type: String,
      enum: ['kitchen', 'bedroom', 'sofa', 'other'],
      required: true,
    },
    orderType: {
      type: String,
      enum: ['market', 'order', 'other'],
      required: true,
    },
    orderPaymentStatus: {
      type: String,
      enum: ['unpaid', 'partiallyPaid', 'paid'],
      default: 'unpaid',
    },
    orderTotalAmount: {
      type: Number,
      required: true,
    },
    orderExpensesAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    orderTotalPaid: {
      type: Number,
      required: false,
      default: 0,
    },
    orderTotalDebt: {
      type: Number,
      required: false,
      default: 0,
    },
    orderExpensesDescription: {
      type: String,
      default: null,
      required: false,
    },
    orderLocation: {
      type: String,
      default: null,
      required: false,
    },
    orderPayments: [
      {
        paymentType: {
          type: String,
          enum: ['cash', 'card'],
          required: false,
        },
        amount: {
          type: Number,
          required: false,
        },
        date: {
          type: String,
          default: moment().format('YYYY-MM-DD-HH:mm'),
        },
      },
    ],
    date: {
      type: String,
      default: moment().format('YYYY-MM-DD-HH:mm'),
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const currentYear = new Date().getFullYear();
    const yearPrefix = currentYear.toString().substr(-2);

    const lastOrder = await this.constructor
      .findOne({
        orderAutoNumber: { $regex: `^${yearPrefix}` },
      })
      .sort({ orderAutoNumber: -1 })
      .exec();

    let orderAutoNumber;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderAutoNumber.slice(2), 10);
      orderAutoNumber = lastNumber + 1;
    } else {
      orderAutoNumber = 1;
    }

    this.orderAutoNumber = `${yearPrefix}${orderAutoNumber.toString().padStart(4, '0')}`;
  }
  next();
});
orderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', orderSchema);

export default Order;
