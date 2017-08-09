var OrderModel = require('../models/mongoose/order.js');

/**
 * OrderController.js
 *
 * @description :: Server-side logic for managing Orders.
 */
module.exports = {
	/**
   * OrderController.index()
   */
	index: function(req, res) {
		OrderModel.find(function(err, Orders) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Order.',
					error: err
				});
			}
			return res.json(Orders);
		});
	},

	/**
   * OrderController.view()
   */
	view: function(req, res) {
		var id = req.params.id;
		OrderModel.findOne({ _id: id }, function(err, Order) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Order.',
					error: err
				});
			}
			if (!Order) {
				return res.status(404).json({
					message: 'No such Order'
				});
			}
			return res.json(Order);
		});
	},

	/**
   * OrderController.create()
   */
	create: function(req, res) {
		var Order = new OrderModel({
			itemCount: req.body.itemCount,
			totalCost: req.body.totalCost,
			userId: req.body.userId
		});

		Order.save(function(err, Order) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating Order',
					error: err
				});
			}
			return res.status(201).json(Order);
		});
	},

	/**
   * OrderController.update()
   */
	update: function(req, res) {
		var id = req.params.id;
		OrderModel.findOne({ _id: id }, function(err, Order) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Order',
					error: err
				});
			}
			if (!Order) {
				return res.status(404).json({
					message: 'No such Order'
				});
			}

			Order.itemCount = req.body.itemCount
				? req.body.itemCount
				: Order.itemCount;
			Order.totalCost = req.body.totalCost
				? req.body.totalCost
				: Order.totalCost;
			Order.userId = req.body.userId ? req.body.userId : Order.userId;

			Order.save(function(err, Order) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating Order.',
						error: err
					});
				}

				return res.json(Order);
			});
		});
	},

	/**
   * OrderController.remove()
   */
	remove: function(req, res) {
		var id = req.params.id;
		OrderModel.findByIdAndRemove(id, function(err, Order) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the Order.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};
