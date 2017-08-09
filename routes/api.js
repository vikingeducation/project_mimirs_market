const router = require("express").Router();
const controllers = require("../controllers");

router.all("/:resource/:id", (req, res) => {
	let controller = controllers[req.params.resource];

	if (!controller) {
		res.json({
			confirmation: "fail",
			resource: "invalid resource"
		});
	}

	// returns the method
	determineMethod(req)(req, res);
});

function determineMethod(req) {
	if (!req.params.id) {
		if (req.method === "GET") {
			return controller.list;
		} else {
			return controller.create;
		}
	} else {
		if (req.method === "GET") {
			return controller.view;
		}

		if (req.method === "PUT") {
			return controller.update;
		}

		if (req.method === "DELETE") {
			return controller.remove;
		}
	}

	return undefined;
}

module.exports = router;
