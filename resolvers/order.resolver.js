import Order from '../models/order.model.js';

const orderResolver = {
  Query: {
    orders: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');
        const userId = await context.getUser()._id;

        const orders = await Order.find({ userId });

        return orders;
      } catch (err) {
        console.error('Error getting orders:', err);
        throw new Error('Error getting orders');
      }
    },
    order: async (_, { id }) => {
      try {
        console.log('id', id);
        const order = await Order.findById(id);
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
        console.log('3');
        if (!context.getUser()) throw new Error('Unauthorized');
        console.log('1');
        console.log('input', input);
        const newOrder = new Order({
          ...input,
          userId: context.getUser()._id,
        });
        console.log('2');
        console.log('newOrder', newOrder);
        await newOrder.save();
        console.log('3');
        return newOrder;
      } catch (err) {
        console.error('Error creating order:', err);
        throw new Error('Error crea');
      }
    },
    //
    updateOrder: async (_, { input }) => {
      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          input.orderId,
          input,
          { new: true }
        );
        return updatedOrder;
      } catch (err) {
        cosole.error('Error updating order:', err);
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
