const loadPromotions = require('./promotions');
const loadAllItems = require('./items')

function bestCharge(selectedItems) {
  let order = selectedItems.map(str => {
    let id = str.split('x')[0].trim();
    let quantity = parseInt(str.split('x')[1].trim());
    let item = findItemById(id);
    return {
      id: id,
      item: item,
      quantity: quantity,
      subtotal: item.price * quantity
    }
  }).reduce((order, item) => {
    order.items.push(item);
    order.price += item.subtotal;
    order.totalPrice += item.subtotal;
    return order;
  }, {items: [], price: 0, discount: 0, totalPrice: 0});

  let discounts = loadPromotions().map(promotion => {
    return {
      promotion: promotion,
      discount: promotion.calculate(order)
    }
  }).sort(((a, b) => b.discount - a.discount));

  order.promotion = discounts[0].promotion;
  order.discount = discounts[0] ? discounts[0].discount : 0;
  order.totalPrice = order.price - order.discount;

  //printOrder
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
