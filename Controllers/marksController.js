const fs = require('fs')

let marks = JSON.parse(fs.readFileSync('./Files/Data/data.json', 'utf-8'))

exports.checkMaGV = (req, res, next, value) => {
    console.log('MaGV is: ' + value)
    let res_marks = marks.find(el => el.MaGV === value)

    if (!res_marks) {
        return res.status(404).json({
            status: "fail",
            requestedAt: req.requestedAt,
            message: "MaGV: \'" + value + "\' is not found"
        })
    }

    next()
}

exports.checkMaMH = (req, res, next, value) => {
    console.log('MaMH is: ' + value)
    let res_marks = marks.find(el => el.MaMH === value)

    if (!res_marks) {
        return res.status(404).json({
            status: "fail",
            requestedAt: req.requestedAt,
            message: "MaMH: \'" + value + "\' is not found"
        })
    }

    next()
}

exports.getAllMarks = (req, res) => {
    res.status(200).json(
        {
            status: "sucess",
            requestedAt: req.requestedAt,
            count: marks.length,
            data: {
                marks: marks
            }
        }
    )
}


exports.checkBody = (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: "fail",
            message: "Not a valid data mark"
        })
    }

    next()
}
exports.createOneMarks = (req, res) => {
    const newID = marks[marks.length - 1].id + 1
    const newMarks = Object.assign({ id: newID }, req.body)
    console.log(newMarks)
    marks.push(newMarks)

    fs.writeFile('./Files/Data/dataMarsk1.json', JSON.stringify(marks), (err) => {
        res.status(201).json(
            {
                status: "sucess",
                requestedAt: req.requestedAt,
                data: {
                    marks: newMarks
                }
            }
        )
    })

    // res.send('Created')
}

exports.getMarksByMaGV = (req, res) => {
    maGV = req.params.MaGV

    let res_marks = marks.filter(el => el.MaGV == maGV)

    // if (Object.keys(res_marks).length == 0) {
    //     return res.status(404).json({
    //         status: "fail",
    //         requestedAt: req.requestedAt,
    //         message: "Marks with MaGV: \'" + maGV + "\' is not found"
    //     })
    // }

    res.status(200).json({
        status: "sucess",
        requestedAt: req.requestedAt,
        data: {
            marks: res_marks
        }
    })
}

exports.updateMarks = (req, res) => {

    const filters = req.params;
    console.log(req.params)

    let marksToUpdate = marks.filter(mark =>
        Object.keys(filters).every(key => mark[key] === filters[key])
    );

    if (Object.keys(marksToUpdate).length == 0) {
        return res.status(404).json({
            status: "fail",
            requestedAt: req.requestedAt,
            message: "Marks with MaGV: \'" + req.params.MaGV + "\' and MaMH: \'" + req.params.MaMH + "\' is not found"
        })
    }

    // let marksToUpdate = marks.filter(el => el.MaGV == maGV)
    let indexMarks = []
    marksToUpdate.forEach(element => {
        indexMarks.push(marks.indexOf(element))
    });

    marksToUpdate = marksToUpdate.map(el => Object.assign(el, req.body))

    for (let i = 0; i < marksToUpdate.length; i++) {
        marks[indexMarks[i]] = marksToUpdate[i]
    }

    // console.log(marks)

    fs.writeFile('./Files/Data/dataMarsk2.json', JSON.stringify(marks), (err) => {
        res.status(201).json(
            {
                status: "sucess",
                requestedAt: req.requestedAt,
                data: {
                    marks: marks
                }
            }
        )
    })
}

exports.deleteMarks = (req, res) => {
    const filters = req.params;

    let marksToDelete = marks.filter(mark =>
        Object.keys(filters).every(key => mark[key] === filters[key])
    );

    if (Object.keys(marksToDelete).length == 0) {
        return res.status(404).json({
            status: "fail",
            requestedAt: req.requestedAt,
            message: "Marks with MaGV: \'" + req.params.MaGV + "\' " + "MaMH: \'" + req.params.MaMH + "\' is not found"
        })
    }

    // let marksToUpdate = marks.filter(el => el.MaGV == maGV)
    let indexMarks = []
    marksToDelete.forEach(element => {
        indexMarks.push(marks.indexOf(element))
    });

    indexMarks.sort((a, b) => b - a)

    indexMarks.forEach(index => {
        marks.splice(index, 1)
    })

    fs.writeFile('./Files/Data/dataMarsk1.json', JSON.stringify(marks), (err) => {
        res.status(204).json(
            {
                status: "sucess",
                requestedAt: req.requestedAt,
                data: {
                    marks: null
                }
            }
        )
    })
}
