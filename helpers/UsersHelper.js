module.exports = {
  usersPath: () => "/users",
  userPath: id => `/users/${id}`,
  newUserPath: () => "/register",
  editUserPath: id => `/users/${id}/edit`,
  destroyUserPath: id => `/users/${id}/?_method=delete`
};
