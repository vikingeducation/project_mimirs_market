module.exports = (req, res, next) => {
  const cookie = req.cookies.cart;
  const cart = cookie ? JSON.parse(cookie) : {};
  res.locals.cart = cart;
  next();
};
