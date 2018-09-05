function bestCharge(selectedItems) {
  var countMap = selectedItems.map(item => {
    return {
      name: item.split('x')[0].trim(),
      quantity: item.split('x')[1].trim()
    }
  });
  console.log(countMap);

  return "Not Implemented";
}

module.exports = bestCharge;
