const { route } = require('./travels');

const router = require('express').Router();
router.use('/travels', require('./travels'));
router.use('/travels/:id/activities',require('./activities'));
router.use('/users',require('./users'))
module.exports = router;
