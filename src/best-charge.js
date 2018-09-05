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

  console.log(order);

  return "Not Implemented";
}

function findItemById(id) {
  return loadAllItems().find(item => item.id === id);
}

module.exports = bestCharge;
