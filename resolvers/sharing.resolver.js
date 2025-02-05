import Sharing from '../models/sharing.model.js';

const sharingResolver = {
  Query: {
    getSharings: async (_, { page, limit, category }) => {
      try {
        const options = {
          page,
          limit,
        };
        const query = {};
        if (category) {
          query.sharingCategoryType = category; // Filter by category if provided
        }
        const result = await Sharing.paginate(query, options);
        return result;
      } catch (error) {
        console.error('Error fetching sharings:', error);
        throw new Error('Error fetching sharings: ' + error.message);
      }
    },
    getSharing: async (_, { id }) => {
      try {
        const sharing = await Sharing.findById(id);
        if (!sharing) {
          throw new Error('not found sharing');
        }
        return sharing;
      } catch (err) {
        console.error('Error getting sharing:', err);
        throw new Error('Error getting sharing');
      }
    },
    categoryStatisticsSharing: async (_, __, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      //const userId = context.getUser()._id;

      // Ensure userId is an ObjectId, even if it's passed as a string
      // const objectIdUserId = new mongoose.Types.ObjectId(userId);

      const categoryStatistics = await Sharing.aggregate([
        // {
        //   $match: {
        //     userId: objectIdUserId, // Correctly use ObjectId for matching
        //   },
        // },
        {
          $group: {
            _id: '$sharingCategoryType', // Group by category
            totalAmount: { $sum: '$sharingAmount' }, // Sum the amounts in each category
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
    createSharing: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');

        const newSharing = new Sharing({
          ...input,
          userId: context.getUser()._id,
        });

        await newSharing.save();

        return newSharing;
      } catch (err) {
        console.error('Error creating sharing:', err);
        throw new Error('Error creating sharing');
      }
    },
    //
    updateSharing: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');

        const { _id, ...updateData } = input;

        const updatedSharing = await Sharing.findByIdAndUpdate(
          _id,
          { $set: updateData },
          { new: true, runValidators: true }
        );

        return updatedSharing;
      } catch (err) {
        console.error('Error updating sharing:', err);
        throw new Error('Error updating sharing');
      }
    },
    //
    deleteSharing: async (_, { sharingId }, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');

        const deletedSharing = await Sharing.findByIdAndDelete(sharingId);

        return deletedSharing;
      } catch (err) {
        console.error('Error on deleting sharing:', err);
        throw new Error('Error deleting sharing');
      }
    },
  },
};

export default sharingResolver;
