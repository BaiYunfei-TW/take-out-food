const loadAllItems = require('./items');

function loadPromotions() {
  return [{
    type: '满30减6元',
    calculate: priceBreakDiscount(30, 6),
    getName: function () {
      return this.type;
    }
  }, {
    type: '指定菜品半价',
    items: ['ITEM0001', 'ITEM0022'],
    calculate: halfPriceDiscount,
    getName: function () {
      let involvedItemsName = this.items.map(id => loadAllItems().find(item => item.id === id))
        .map(item => item.name);
      return `${this.type}(${involvedItemsName.join("，")})`
    }
  }];
}

function priceBreakDiscount(upTo, discount) {
  return function (order) {
    if (order.price >= upTo) {
      return discount;
    }
    return 0;
  }
}

function halfPriceDiscount(order) {
  return order.items.filter(item => this.items.includes(item.id))
    .reduce((totalPrice, item) => totalPrice + item.subtotal, 0) / 2;
}

module.exports = loadPromotions;
