const exp = require('constants')
const classes = require('../Models/classModel')
const url = require('url')
const convertQuery = (query, schema) => {
    // Create a new object to store the converted query
    const converted = {};
    // Loop through the query fields
    for (let key in query) {
      // Get the value of the query field
      let value = query[key];
      // Get the type of the schema field
      let type = schema.paths[key].instance;
      // Convert the value to the correct type
      switch (type) {
        case "Number":
          value = Number(value);
          break;
        case "Boolean":
          value = Boolean(value);
          break;
        case "Date":
          value = new Date(value);
          break;
        // Add more cases for other types as needed
      }
      // Assign the converted value to the new object
      converted[key] = value;
    }
    // Return the new object
    return converted;
  };
exports.getClasses = async (req, res) => {
    try {
        const marks = await classes.find(req.query)
        if (marks.length != 0) {
            res.status(200).json({
                status: 'succes',
                length: marks.length,
                data: marks
            })
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Data is not valid!'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getGiaoVien = async (req, res) => {
    try {
        // console.log(req.query)
        let convertedQuery = convertQuery(req.query, classes.schema)
        let giaoVien = await classes.aggregate([
            { $match: convertedQuery },
            { $group: { _id: { MaGV: "$MaGV", HoTenGV: "$HoTenGV" } } },
            { $project: { _id: 0, MaGV: "$_id.MaGV", HoTenGV: "$_id.HoTenGV" } }
        ]);
        // console.log(giaoVien)
        if (giaoVien.length != 0) {
            res.status(200).json({
                status: 'succes',
                length: giaoVien.length,
                data: giaoVien
            })
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Data is not valid!'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMonHoc = async (req, res) => {
    try {
        // console.log(req.query)
        let convertedQuery = convertQuery(req.query, classes.schema)
        let monHoc = await classes.aggregate([
            { $match: convertedQuery },
            { $group: { _id: { MaMH: "$MaMH", TenMH: "$TenMH" } } },
            { $project: { _id: 0, MaMH: "$_id.MaMH", TenMH: "$_id.TenMH" } }
        ]);
        // console.log(monHoc)
        if (monHoc.length != 0) {
            res.status(200).json({
                status: 'succes',
                length: monHoc.length,
                data: monHoc
            })
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Data is not valid!'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getHocKy = async (req, res) => {
    try {
        let convertedQuery = convertQuery(req.query, classes.schema)
        const hocKy = await classes.distinct('HocKy', convertedQuery)     
        if (hocKy.length != 0) {
            res.status(200).json({
                status: 'success',
                count: hocKy.length,
                data: hocKy
            })
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Data is not valid!'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}
exports.createClass = async (req, res) => {
    try {

        const marks = await classes.find()
        const lastIndex = Number(marks[marks.length - 1]._id)
        const markCreated = Object.assign({ _id: (lastIndex + 1).toString() }, req.body)
        const mark = await classes.create(markCreated)
        res.status(201).json({
            status: 'success',
            data: mark
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateClasses = async (req, res) => {
    try {
        await classes.updateMany(req.query, { $set: req.body }, { runValidators: true })
        const marksUpdated = await classes.find(req.query)

        res.status(200).json({
            status: 'succes',
            length: marksUpdated.length,
            data: marksUpdated
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteClasses = async (req, res) => {
    try {
        await classes.deleteMany(req.query)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

