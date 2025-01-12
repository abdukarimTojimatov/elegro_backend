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
    order: async (_, { orderId }) => {
      try {
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
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      const userId = context.getUser()._id;
      const orders = await Order.find({ userId });
      const categoryMap = {};

      // const transactions = [
      // 	{ category: "expense", amount: 50 },
      // 	{ category: "expense", amount: 75 },
      // 	{ category: "investment", amount: 100 },
      // 	{ category: "saving", amount: 30 },
      // 	{ category: "saving", amount: 20 }
      // ];

      orders.forEach((order) => {
        if (!categoryMap[order.category]) {
          categoryMap[order.category] = 0;
        }
        categoryMap[order.category] += order.amount;
      });

      // categoryMap = { expense: 125, investment: 100, saving: 50 }

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
      // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
    },
  },
  Mutation: {
    //
    createOrder: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');

        console.log('1');
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
