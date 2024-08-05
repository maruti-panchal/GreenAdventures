const { Router } = require('express');
const {
  addTourController,
  getToursController,
  updateTourController,
  deleteTourController,
  getTourController,
  aliastopTours,
  tourStats,
  getMonthlyPlan,
} = require('../contollers/toursController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();
router.route('/top-5-cheap').get(aliastopTours, getToursController);
router
  .route('/')
  .get(authMiddleware.isLogged, getToursController)
  .post(addTourController);
router.route('/tour-stats').get(tourStats);
router.route('/monthly-tour-stats/:year').get(getMonthlyPlan);
router
  .route('/:id')
  .get(authMiddleware.isLogged, getTourController)
  .patch(updateTourController)
  .delete(
    authMiddleware.isLogged,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    deleteTourController
  );

module.exports = router;
