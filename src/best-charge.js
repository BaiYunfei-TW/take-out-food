const loadPromotions = require('./promotions');
const loadAllItems = require('./items');

const _ = require('lodash');

module.exports = function bestCharge(selectedItems) {
  return (_.flow([
    countItemsAndCalculateSubtotal,
    generateOrderAndCalculatePrice,
    selectBestPromotion,
    renderInvoice
  ]))(selectedItems);
}

function countItemsAndCalculateSubtotal(selectedItems) {
  return selectedItems.map(str => {
    let id = str.split('x')[0].trim();
    let quantity = parseInt(str.split('x')[1].trim());
    let item = findItemById(id);
    return {
      id: id,
      item: item,
      quantity: quantity,
      subtotal: item.price * quantity
    }
  });
}

function generateOrderAndCalculatePrice(itemList) {
  return itemList.reduce((order, item) => {
    order.items.push(item);
    order.price += item.subtotal;
    order.totalPrice += item.subtotal;
    return order;
  }, {
      price: 0,
      items: [],
      discount: 0,
      totalPrice: 0
  });
}

function selectBestPromotion(order) {
  return loadPromotions().reduce((order, promotion) => {
    let discount = promotion.calculate(order);
    if (discount > order.discount) {
      order.discount = discount;
      order.promotion = promotion;
      order.totalPrice = order.price - discount;
    }
    return order;
  }, order);
}

function renderInvoice(order) {
  let invoice = '============= 订餐明细 =============\n';
  invoice += order.items.map(item => `${item.item.name} x ${item.quantity} = ${item.subtotal}元\n`).join("")
  invoice += '-----------------------------------\n';
  if (order.discount !== 0) {
    invoice += '使用优惠:\n';
    invoice += `${order.promotion.getName()}，省${order.discount}元\n`;
    invoice += '-----------------------------------\n';
  }
  invoice += `总计：${order.totalPrice}元\n`;
  invoice += '===================================';
  return invoice;
}

function findItemById(id) {
  return loadAllItems().find(item => item.id === id);
}
