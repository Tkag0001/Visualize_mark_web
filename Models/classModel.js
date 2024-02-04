const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: [true, '_id is required field!'],
        unique: true
    },
    HocKy:{
        type: Number,
        required: [true, 'HocKy is required field!']
    },
    MaKhoa:{
        type: String,
        required: [true, 'MaKhoa is required field!']
    },
    Khoa: {
        type: String,
        required: [true, 'Khoa is required field!']
    },
    MaGV: String,
    HoTenGV: String,
    TenMH: {
        type: String,
        required: [true, 'TenMH is required field!']
    },
    MaMH: {
        type: String,
        required: [true, 'MaMH is required field!']
    },
    MaLop: {
        type: String,
        required: [true, 'MaLop is required field!']
    },
    SLDK: {
        type: Number,
        default: 0
    },
    SLD: {
        type: Number,
        default: 0
    },
    SLKD: {
        type: Number,
        default: 0
    },
    Diem0_SL: {
        type: Number,
        default: 0
    },
    Diem1_SL: {
        type: Number,
        default: 0
    },
    Diem2_SL: {
        type: Number,
        default: 0
    },
    Diem3_SL: {
        type: Number,
        default: 0
    },
    Diem4_SL: {
        type: Number,
        default: 0
    },
    Diem5_SL: {
        type: Number,
        default: 0
    },
    Diem6_SL: {
        type: Number,
        default: 0
    },
    Diem7_SL: {
        type: Number,
        default: 0
    },
    Diem8_SL: {
        type: Number,
        default: 0
    },
    Diem9_SL: {
        type: Number,
        default: 0
    },
    Diem10_SL: {
        type: Number,
        default: 0
    }
})

const class_marks = mongoose.model('test', classSchema)

module.exports = class_marks