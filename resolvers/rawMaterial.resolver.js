import RawMaterial from '../models/rawMaterial.model.js';

const rawMaterialResolvers = {
  Query: {
    getRawMaterials: async () => {
      try {
        return await RawMaterial.find();
      } catch (error) {
        console.error('Error fetching raw materials:', error);
        throw new Error('Error fetching raw materials: ' + error.message);
      }
    },

    getRawMaterial: async (_, { id }) => {
      try {
        const rawMaterial = await RawMaterial.findById(id);
        if (!rawMaterial) {
          throw new Error('Raw Material not found');
        }
        return rawMaterial;
      } catch (error) {
        console.error('Error fetching raw material:', error);
        throw new Error('Error fetching raw material: ' + error.message);
      }
    },
  },

  Mutation: {
    createRawMaterial: async (_, { input }, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      const rawMaterial = new RawMaterial({
        ...input,
        userId: context.getUser()._id,
      });

      try {
        return await rawMaterial.save();
      } catch (error) {
        console.error('Error creating raw material:', error);
        throw new Error('Error creating raw material: ' + error.message);
      }
    },

    updateRawMaterial: async (_, { input }) => {
      const { rawMaterialId, ...updateData } = input;
      try {
        const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(
          rawMaterialId,
          { $set: updateData },
          { new: true, runValidators: true }
        );
        if (!updatedRawMaterial) {
          throw new Error('Raw Material not found');
        }
        return updatedRawMaterial;
      } catch (error) {
        console.error('Error updating raw material:', error);
        throw new Error('Error updating raw material: ' + error.message);
      }
    },

    deleteRawMaterial: async (_, { createRawMaterialId }) => {
      try {
        const deletedRawMaterial =
          await RawMaterial.findByIdAndDelete(createRawMaterialId);
        if (!deletedRawMaterial) {
          throw new Error('Raw Material not found');
        }
        return deletedRawMaterial;
      } catch (error) {
        console.error('Error deleting raw material:', error);
        throw new Error('Error deleting raw material: ' + error.message);
      }
    },
  },
};

export default rawMaterialResolvers;
