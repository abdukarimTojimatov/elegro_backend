import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';

const rawMaterialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      // bu yerda false bo'ldimi demak typedefda ham false bo'lishi kerak
    },
    rawMaterialName: {
      type: String,
      required: true,
    },
    rawMaterialDescription: {
      type: String,
      required: false,
    },
    rawMaterialDescription: {
      type: String,
      required: false,
    },
    rawMaterialQuantity: {
      type: Number,
      required: true,
    },
    unitOfMeasurement: {
      type: String,
      required: true,
      enum: ['kg', 'gr', 'meter', 'dona', 'liter', 'qop', 'metrkv'],
    },
    rawMaterialPrice: {
      type: Number,
      required: true,
    },
    payments: [
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
    rawMaterialTotalPrice: {
      type: Number,
      required: false,
    },
    totalPaid: {
      type: Number,
      required: false,
      default: 0,
    },
    totalDebt: {
      type: Number,
      required: false,
      default: 0,
    },
    date: {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm'),
    },
  },
  { timestamps: true, versionKey: false }
);

rawMaterialSchema.pre('save', function (next) {
  const totalPaid = this.payments.reduce(
    (acc, payment) => acc + (payment.amount || 0),
    0
  );
  this.totalPaid = totalPaid;
  this.totalDebt = this.rawMaterialTotalPrice - totalPaid;

  // Calculate rawMaterialTotalPrice
  this.rawMaterialTotalPrice = this.rawMaterialQuantity * this.rawMaterialPrice;

  next();
});

rawMaterialSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.$set) {
    if (update.$set.payments) {
      const currentDoc = await this.model.findOne(this.getQuery());
      if (currentDoc) {
        const updatedPayments = update.$set.payments;
        const totalPaid = updatedPayments.reduce(
          (acc, payment) => acc + (payment.amount || 0),
          0
        );
        this.set({
          totalPaid: totalPaid,
          totalDebt: currentDoc.rawMaterialTotalPrice - totalPaid,
        });
      }
    }

    // Calculate rawMaterialTotalPrice if rawMaterialQuantity or rawMaterialPrice is updated
    if (update.$set.rawMaterialQuantity || update.$set.rawMaterialPrice) {
      const quantity =
        update.$set.rawMaterialQuantity || currentDoc.rawMaterialQuantity;
      const price = update.$set.rawMaterialPrice || currentDoc.rawMaterialPrice;
      this.set('rawMaterialTotalPrice', quantity * price);
    }
  }
  next();
});
rawMaterialSchema.plugin(mongoosePaginate);
const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

export default RawMaterial;
