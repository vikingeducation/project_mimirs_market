$(() => {
  const socket = io.connect();
  let cart = getCookie('cart');
  let cartObj;

  if (cart) cartObj = JSON.parse(unescape(cart));

  for (let button of $('.add-to-cart')) {
    let productId = button.id;

    if (cartObj && cartObj[productId]) {
      changeButton($(`.add-to-cart#${ productId }`));
    }
  }

  $('.add-to-cart').click((e) => {
    e.preventDefault();
    let cart = getCookie('cart');

    const productId = e.target.id;

    const cartData = { productId, cart };

    socket.emit('addToCart', cartData);
  });

  socket.on('newCartItem', (cartData, navPartial) => {
    set_cookie('cart', cartData.cart);

    changeButton($(`.add-to-cart#${ cartData.productId }`));

    $('#mainNav').html(navPartial);
  });
});

function set_cookie(name, value) {
  document.cookie = name +'='+ value +'; Path=/;';
}

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name) {
  match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

function changeButton(button) {
  button
    .text('Edit in Cart')
    .removeClass('btn-primary')
    .removeClass('add-to-cart')
    .off('click')
    .addClass('btn-success')
    .attr('href','/checkout/cart');
}
