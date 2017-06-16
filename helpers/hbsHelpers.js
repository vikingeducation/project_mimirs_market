var hbsHelper = {};


hbsHelper.formatAsCurrency = function(number) {
  return ((number / 100)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    }));
};

hbsHelper.findQuantityinCart = function(itemID, cart) {
  let quantity = null;
  cart.forEach(function(item, index, array) {
    if (itemID.toString() === item.id.toString()) quantity = item.quantity;
  });
  return quantity;
}


module.exports = hbsHelper;
