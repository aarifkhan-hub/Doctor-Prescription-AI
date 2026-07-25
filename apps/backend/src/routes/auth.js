const router = require('express').Router();
const ctrl = require('../controllers/authController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const v = require('../validators/auth');

router.post('/register', authLimiter, validate({ body: v.registerSchema }), ctrl.register);
router.post('/login',    authLimiter, validate({ body: v.loginSchema }),    ctrl.login);
router.post('/refresh',                validate({ body: v.refreshSchema }), ctrl.refresh);
router.post('/logout',   requireAuth,                                        ctrl.logout);
router.get('/me',        requireAuth,                                        ctrl.me);

module.exports = router;
