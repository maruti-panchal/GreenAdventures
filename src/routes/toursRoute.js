const { Router } = require('express');
const {
  addTourController,
  getToursController,
  updateTourController,
  deleteTourController,
  getTourController,
} = require('../contollers/toursController');

const router = Router();

router.route('/').get(getToursController).post(addTourController);
router
  .route('/:id')
  .get(getTourController)
  .patch(updateTourController)
  .delete(deleteTourController);

module.exports = router;
