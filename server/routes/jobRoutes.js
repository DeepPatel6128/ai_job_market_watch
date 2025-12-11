const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/search', jobController.search);
router.get('/', jobController.getAll);

module.exports = router;
