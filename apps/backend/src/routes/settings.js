const router = require('express').Router();
const ctrl = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.get);
router.put('/', requireAuth, ctrl.update);

module.exports = router;
