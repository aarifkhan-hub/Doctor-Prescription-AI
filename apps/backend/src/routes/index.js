const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/prescriptions', require('./prescriptions'));
router.use('/settings', require('./settings'));
router.use('/', require('./health'));

module.exports = router;
