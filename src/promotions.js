function loadPromotions() {
  return [{
    type: '满30减6元',
    calculate: priceBreakDiscount(30, 6)
  }, {
    type: '指定菜品半价',
    items: ['ITEM0001', 'ITEM0022'],
    calculate: halfPriceDiscount(['ITEM0001', "ITEM0022"])
  }];
}

function priceBreakDiscount(upTo, discount) {
  return function(order){
    if (order.price >= upTo) {
      return discount;
    }
    return 0;
  }
}

function halfPriceDiscount(items) {
  return function (order) {
    return order.items.filter(item => items.includes(item.id))
      .reduce((totalPrice, item) => totalPrice + item.subtotal, 0) / 2;
  };
}

module.exports = loadPromotions;
