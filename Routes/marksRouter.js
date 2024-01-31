const express = require('express')
const marksController = require('../Controllers/marksController')

const router = express.Router()

router.param('MaGV', marksController.checkMaGV)
router.param('MaMH', marksController.checkMaMH)

router.route('/')
    .get(marksController.getAllMarks)
    .post(marksController.checkBody, marksController.createOneMarks)

router.route('/:MaGV').get(marksController.getMarksByMaGV)

router.route('/:MaGV/:MaMH?')
    .patch(marksController.updateMarks)
    .delete(marksController.deleteMarks)

module.exports = router