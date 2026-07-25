const router = require('express').Router();
const ctrl = require('../controllers/prescriptionController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimit');
const v = require('../validators/prescription');

router.post('/', requireAuth, uploadLimiter, upload.single('image'), ctrl.upload);
router.get('/',  requireAuth, validate({ query: v.listSchema }), ctrl.list);
router.get('/:id',    requireAuth, validate({ params: v.idSchema }), ctrl.getOne);
router.delete('/:id', requireAuth, validate({ params: v.idSchema }), ctrl.remove);

module.exports = router;
