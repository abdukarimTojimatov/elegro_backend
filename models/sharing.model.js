import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sharingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharingDescription: {
    type: String,
    required: false,
  },
  sharingPaymentType: {
    type: String,
    enum: ['naqd', 'plastik'],
    required: true,
  },
  sharingAmount: {
    type: Number,
    required: true,
  },
  sharingDate: {
    type: String,
  },
});
sharingSchema.plugin(mongoosePaginate);
const Sharing = mongoose.model('Sharing', sharingSchema);

export default Sharing;
