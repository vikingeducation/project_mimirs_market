$(() => {
  let cart = getCookie('cart');
  let cartObj;
  if (cart) {
    cartObj = JSON.parse(unescape(cart));

    for (let id of Object.keys(cartObj)) {
      $(`input#${ id }`).val(cartObj[id].quantity);
    }
  }
});

function getCookie(name) {
  match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
