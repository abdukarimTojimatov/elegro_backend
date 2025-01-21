import Transaction from '../models/transaction.model.js';
import mongoose from 'mongoose';
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error('Error getting transactions:', err);
        throw new Error('Error getting transactions');
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
          throw new Error('not found transaction');
        }
        return transaction;
      } catch (err) {
        console.error('Error getting transaction:', err);
        throw new Error('Error getting transaction');
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      const userId = context.getUser()._id;

      // Ensure userId is an ObjectId, even if it's passed as a string
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      const categoryStatistics = await Transaction.aggregate([
        {
          $match: {
            userId: objectIdUserId, // Correctly use ObjectId for matching
          },
        },
        {
          $group: {
            _id: '$category', // Group by category
            totalAmount: { $sum: '$amount' }, // Sum the amounts in each category
          },
        },
        {
          $project: {
            category: '$_id', // Rename _id to category
            totalAmount: 1, // Include totalAmount
            _id: 0, // Exclude _id from the result
          },
        },
      ]);

      console.log('Category Statistics:', categoryStatistics);
      return categoryStatistics;
    },
  },
  Mutation: {
    //
    createTransaction: async (_, { input }, context) => {
      try {
        console.log('1');
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        console.log('2');
        console.log('newTransaction', newTransaction);
        await newTransaction.save();
        console.log('3');
        return newTransaction;
      } catch (err) {
        console.error('Error creating transaction:', err);
        throw new Error('Error crea');
      }
    },
    //
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (err) {
        cosole.error('Error updating transaction:', err);
        throw new Error('Error updating transaction');
      }
    },
    //
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction =
          await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (err) {
        console.error('Error on deleting transaction:', err);
        throw new Error('Error deleting transaction');
      }
    },
  },
};

export default transactionResolver;
