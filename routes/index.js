const router = require('./api');

router.get('/', (req, res) => {
	res.render('landing', {
		layout: 'main-no-nav'
	});
});

module.exports = router;
