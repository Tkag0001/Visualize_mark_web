const express = require('express')
const classes = require('../Controllers/classController')
const router = express.Router()

router.route('/')
    .get(classes.getClasses)
    .post(classes.createClass)
    .delete(classes.deleteClasses)
    .patch(classes.updateClasses)
    
// router.route('/:MaMH/:MaGV?')
//     .patch(classes.updateClass)
//     .delete(classes.deleteClass)

router.route('/giaovien')
    .get(classes.getGiaoVien)

router.route('/monhoc')
    .get(classes.getMonHoc)    
    
router.route('/hocky')
    .get(classes.getHocKy)
        
module.exports = router