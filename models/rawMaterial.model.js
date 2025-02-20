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
    },
    rawMaterialName: {
      type: String,
      required: true,
    },
    rawMaterialDescription: {
      type: String,
      required: false,
    },
    rawMaterialCategory: {
      type: String,
      required: true,
      enum: ['Machalka', 'Mehanizm', 'Kraska', 'Temir', 'Material'],
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
    paymentStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
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

rawMaterialSchema.plugin(mongoosePaginate);
const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

export default RawMaterial;
