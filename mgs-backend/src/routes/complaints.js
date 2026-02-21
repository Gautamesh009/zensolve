const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { submitComplaint, getMyComplaints } = require('../controllers/complaintController');

router.post('/', upload.single('image'), submitComplaint);
router.get('/my', getMyComplaints);

module.exports = router;
