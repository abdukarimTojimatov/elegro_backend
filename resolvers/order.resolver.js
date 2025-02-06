import Order from '../models/order.model.js';
import mongoose from 'mongoose';

const orderResolver = {
  Query: {
    getOrders: async (
      _,
      { page, limit, orderCategory, orderStatus, orderType, orderPaymentStatus }
    ) => {
      try {
        const query = {};
        if (orderCategory) query.orderCategory = orderCategory;
        if (orderStatus) query.orderStatus = orderStatus;
        if (orderType) query.orderType = orderType;
        if (orderPaymentStatus) query.orderPaymentStatus = orderPaymentStatus;
        console.log('query', query);
        const options = {
          page,
          limit,
        };
        const result = await Order.paginate(query, options);
        return result; // Ensure this returns the correct paginated structure
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Error fetching orders: ' + error.message);
      }
    },
    getOrder: async (_, { id }) => {
      try {
        console.log('orderId', id);
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
        if (!context.getUser()) throw new Error('Unauthorized');
        console.log('input', input);
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
    deleteOrder: async (_, { id }) => {
      try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        return deletedOrder;
      } catch (err) {
        console.error('Error on deleting order:', err);
        throw new Error('Error deleting order');
      }
    },
  },
};

export default orderResolver;
