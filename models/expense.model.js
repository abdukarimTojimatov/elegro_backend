import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const expenseSchema = new mongoose.Schema({
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
expenseSchema.plugin(mongoosePaginate);
const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
