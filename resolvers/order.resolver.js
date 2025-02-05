import Order from '../models/order.model.js';

const orderResolver = {
  Query: {
    getOrders: async (_, { page = 1, limit = 10 }) => {
      try {
        const options = {
          page,
          limit,
        };
        const result = await Order.paginate({}, options);
        return result;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Error fetching orders: ' + error.message);
      }
    },
    getOrder: async (_, { orderId }) => {
      try {
        console.log('orderId', orderId);
        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error('not found order');
        }
        return order;
      } catch (err) {
        console.error('Error getting order:', err);
        throw new Error('Error getting order');
      }
    },
  },
  Mutation: {
    //
    createOrder: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');

        const newOrder = new Order({
          ...input,
          userId: context.getUser()._id,
        });

        await newOrder.save();

        return newOrder;
      } catch (err) {
        console.error('Error creating order:', err);
        throw new Error('Error crea');
      }
    },
    //
    updateOrder: async (_, { input }) => {
      try {
        console.log('input', input);
        const { orderId, ...updateData } = input;
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { $set: updateData },
          { new: true, runValidators: true }
        );
        return updatedOrder;
      } catch (err) {
        console.error('Error updating order:', err);
        throw new Error('Error updating order');
      }
    },
    //
    deleteOrder: async (_, { orderId }) => {
      try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        return deletedOrder;
      } catch (err) {
        console.error('Error on deleting order:', err);
        throw new Error('Error deleting order');
      }
    },
  },
};

export default orderResolver;
