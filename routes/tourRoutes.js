const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const router = express.Router();

// Middleware that checks for valid id
// router.param('id', checkId);

// Create checkbody middlware func
// check if body contains the name and price property
// if not , send back 400 Back request
// Add it to the post handler stack

// aliasTopTours middlware first, then getAllTours runs second
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// // agregation
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
