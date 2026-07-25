const router = require('express').Router();
const ctrl = require('../controllers/healthController');

router.get('/health', ctrl.live);
router.get('/ready', ctrl.ready);

module.exports = router;
