const router = require('express').Router();
const controllers = require('../controllers');
const asyncRoutes = require('./async');

let controller;
router.all('/:resource/:id?', (req, res, next) => {
	controller = controllers[req.params.resource];
	if (controller === undefined) {
		res.json({
			confirmation: 'fail',
			resource: 'invalid resource'
		});
		return;
	}
	// returns the method
	const method = determineMethod(req);
	if (!method) {
		return res.status(404).json({
			msg: 'Error, the requested resource was not found.'
		});
	}

	method(req, res);
});

router.use('/api', asyncRoutes);

function determineMethod(req) {
	if (req.params.id !== undefined) {
		if (req.method === 'GET') {
			return controller.view;
		}

		if (req.method === 'PUT') {
			return controller.create;
		}

		if (req.method === 'PATCH') {
			return controller.update;
		}

		if (req.method === 'DELETE') {
			return controller.remove;
		}
	} else {
		if (req.method === 'GET') {
			return controller.index;
		} else {
			return controller.create;
		}
	}

	return undefined;
}

module.exports = router;
