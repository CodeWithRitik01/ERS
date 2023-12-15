const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin_controller');

router.get('/employee', adminController.EmployeePage);
router.get('/delete/:id', adminController.deleteEmployee);
router.get('/assignWork', adminController.assignWork);
router.get('/showReview', adminController.showReview);
router.post('/assign', adminController.selectToReview);
router.post('/newAdmin', adminController.newAdmin);
router.post('/removeAdmin', adminController.removeAdmin);

module.exports = router;