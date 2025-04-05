import CartModel from '../models/cart.js';

export default class MongoCartDao {
  async getById(id) {
    return CartModel.findById(id).populate('items.product');
  }

  async addItem(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    return cart.save();
  }

  async removeItem(cartId, productId) {
    return CartModel.findByIdAndUpdate(cartId, {
      $pull: { items: { product: productId } }
    }, { new: true });
  }

  async clear(cartId) {
    return CartModel.findByIdAndUpdate(cartId, { items: [] }, { new: true });
  }
}