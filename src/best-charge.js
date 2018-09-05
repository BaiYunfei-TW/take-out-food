const loadPromotions = require('./promotions');
const loadAllItems = require('./items');

const _ = require('lodash');

function bestCharge(selectedItems) {
  return (_.flow([
    countItems,
    generateOrderAndCalculatePrice,
    selectPromotion,
    renderInvoice
  ]))(selectedItems);
}

function countItems(selectedItems) {
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

function selectPromotion(order) {
  let discounts = loadPromotions().map(promotion => {
    return {
      promotion: promotion,
      discount: promotion.calculate(order)
    }
  }).sort(((a, b) => b.discount - a.discount));

  let bestDiscount = discounts[0];
  order.promotion = bestDiscount ? bestDiscount.promotion : null;
  order.discount = bestDiscount ? bestDiscount.discount : 0;
  order.totalPrice = order.price - order.discount;

  return order;
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

module.exports = bestCharge;
