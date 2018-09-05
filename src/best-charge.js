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

  order.promotion = discounts[0];
  order.discount = discounts[0] ? discounts[0].discount : 0;
  order.totalPrice = order.price - order.discount;

  console.log(order);

  return "Not Implemented";
}

function findItemById(id) {
  return loadAllItems().find(item => item.id === id);
}

module.exports = bestCharge;
