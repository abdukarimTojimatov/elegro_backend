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
      enum: ['oshxona', 'yotoqxona', 'yumshoq mebel', 'boshqa'],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['qabul qilingan', 'tayyorlanayabdi', 'tayyor', 'ornatildi'],
      default: 'qabul qilingan',
    },
    orderType: {
      type: String,
      enum: ['bozor', 'buyurtma', 'boshqa'],
      required: true,
    },
    orderPaymentStatus: {
      type: String,
      enum: ['tolanmadi', 'qismanTolandi', 'tolandi'],
      default: 'tolanmadi',
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
          enum: ['naqd', 'plastik'],
          required: false,
        },
        amount: {
          type: Number,
          required: false,
        },
        date: {
          type: String,
          required: false,
        },
      },
    ],
    date: {
      type: String,
      default: moment().format('YYYY-MM-DD-HH:mm'),
    },
    orderReadyDate: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

// Use a middleware that runs before save or update operations
orderSchema.pre('save', async function (next) {
  // Handle auto-number generation for new documents
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

  // Payment calculations
  const totalPaid = this.orderPayments.reduce(
    (acc, payment) => acc + (payment.amount || 0),
    0
  );

  // Update payment status
  if (totalPaid === 0) {
    this.orderPaymentStatus = 'tolanmadi'; // unpaid
  } else if (totalPaid < this.orderTotalAmount) {
    this.orderPaymentStatus = 'qismanTolandi'; // partially paid
  } else {
    this.orderPaymentStatus = 'tolandi'; // paid
  }

  // Update total paid and debt
  this.orderTotalPaid = totalPaid;
  this.orderTotalDebt = this.orderTotalAmount - totalPaid;

  next();
});

// Add a pre-update middleware to handle updates
orderSchema.pre('findOneAndUpdate', async function (next) {
  try {
    // Get the update document
    const update = this.getUpdate();

    // If orderPayments is being modified
    if (update.$set && update.$set.orderPayments) {
      // Find the current document
      const currentDoc = await this.model.findOne(this.getQuery());

      if (currentDoc) {
        // Create a clone of the current document and update orderPayments
        const updatedDoc = {
          ...currentDoc.toObject(),
          orderPayments: update.$set.orderPayments,
        };

        // Calculate total paid
        const totalPaid = updatedDoc.orderPayments.reduce(
          (acc, payment) => acc + (payment.amount || 0),
          0
        );

        // Determine payment status
        let orderPaymentStatus;
        if (totalPaid === 0) {
          orderPaymentStatus = 'tolanmadi';
        } else if (totalPaid < updatedDoc.orderTotalAmount) {
          orderPaymentStatus = 'qismanTolandi';
        } else {
          orderPaymentStatus = 'tolandi';
        }

        // Add these calculated fields to the update
        this.set({
          orderPaymentStatus,
          orderTotalPaid: totalPaid,
          orderTotalDebt: updatedDoc.orderTotalAmount - totalPaid,
        });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

orderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', orderSchema);

export default Order;
