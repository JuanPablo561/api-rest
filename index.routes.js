const { Router } = require('express');
const { home, marco, ping } = require('../controllers/index.controller');

const router = Router();

router.get('/', home);
router.get('/marco', marco);
router.get('/ping', ping);

module.exports = router;
