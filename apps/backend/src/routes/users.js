const router = require('express').Router();
const ctrl = require('../controllers/userController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const v = require('../validators/auth');

router.patch('/me',          requireAuth, validate({ body: v.updateProfileSchema }),  ctrl.updateProfile);
router.patch('/me/password', requireAuth, validate({ body: v.changePasswordSchema }), ctrl.changePassword);

module.exports = router;
