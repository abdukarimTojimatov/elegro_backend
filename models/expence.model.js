import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const expenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['naqd', 'plastik'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Laminad', 'Mashina xarajatlari', 'Soliq', 'Elektr', 'Abduzunnun'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
  },
});
expenceSchema.plugin(mongoosePaginate);
const Expence = mongoose.model('Expence', expenceSchema);

export default Expence;
