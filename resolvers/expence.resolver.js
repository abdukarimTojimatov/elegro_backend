import Expence from '../models/expence.model.js';
import mongoose from 'mongoose';
const expenceResolver = {
  Query: {
    expences: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');
        const userId = await context.getUser()._id;

        const expences = await Expence.find({ userId });
        return expences;
      } catch (err) {
        console.error('Error getting expences:', err);
        throw new Error('Error getting expences');
      }
    },
    expence: async (_, { expenceId }) => {
      try {
        const expence = await Expence.findById(expenceId);
        if (!expence) {
          throw new Error('not found expence');
        }
        return expence;
      } catch (err) {
        console.error('Error getting expence:', err);
        throw new Error('Error getting expence');
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      const userId = context.getUser()._id;

      // Ensure userId is an ObjectId, even if it's passed as a string
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      const categoryStatistics = await Expence.aggregate([
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
    createExpence: async (_, { input }, context) => {
      try {
        const newExpence = new Expence({
          ...input,
          userId: context.getUser()._id,
        });
        console.log('2');
        console.log('newExpence', newExpence);
        await newExpence.save();
        console.log('3');
        return newExpence;
      } catch (err) {
        console.error('Error creating expence:', err);
        throw new Error('Error crea');
      }
    },
    //
    updateExpence: async (_, { input }) => {
      try {
        const updateExpence = await Expence.findByIdAndUpdate(
          input.expenceId,
          input,
          { new: true }
        );
        return updateExpence;
      } catch (err) {
        cosole.error('Error updating expence:', err);
        throw new Error('Error updating expence');
      }
    },
    //
    deleteExpence: async (_, { expenceId }) => {
      try {
        const deletedExpence = await Expence.findByIdAndDelete(expenceId);
        return deletedExpence;
      } catch (err) {
        console.error('Error on deleting expence:', err);
        throw new Error('Error deleting expence');
      }
    },
  },
};

export default expenceResolver;
