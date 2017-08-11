const getModelWrapper = require('../models/index');
/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {
	/**
   * UserController.index()
   */
	index: function(req, res) {
		let wrapper = getModelWrapper();

		wrapper
			.findAllUsers()
			.then(_renderUsersIndex)
			.catch(_catchError.call(res, 'Error getting users from database.'));

		function _renderUsersIndex(users) {
			res.render('users/index', { users });
		}
	},

	/**
   * UserController.view()
   */
	view: function(req, res) {
		let wrapper = getModelWrapper();
		const id = req.params.id;

		wrapper
			.findUserById(id)
			.then(_renderUserView)
			.catch(_catchError.call(res, 'Error getting user from database.'));

		function _renderUserView(user) {
			if (!user) {
				return res.status(404).json({
					message: 'No such User'
				});
			}
			res.render('users/view', { user });
		}
	}
};

const _catchError = msg => err => {
	return this.status(500).json({
		message: msg,
		error: err
	});
};
