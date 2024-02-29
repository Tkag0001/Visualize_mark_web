google.charts.load('current', { packages: ['corechart'] })
const url_MaMH = "http://localhost:3000/api/v1/classes/monhoc/?"
const url_MaGV = "http://localhost:3000/api/v1/classes/giaovien/?"
const url_HocKy = "http://localhost:3000/api/v1/classes/hocky/?"
const url_Classes = "http://localhost:3000/api/v1/classes/?"
const url_MaLop = "http://localhost:3000/api/v1/classes/malop/?"

//Format ISODate to common time
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${day}-${month}-${year} | ${hours}:${minutes}`
}

async function getJsonData(url) {
    try {
        const response = await fetch(url)
        const jsonData = await response.json()
        if (jsonData.data.length != 0) {
            return jsonData.data
        }
        else
            return null
    }
    catch (error) {
        console.log(error.message)
        swal({
            title: "Warning!",
            text: "Can't find any data, please check your request!",
            icon: "warning",
        })
        return null
    }
}

function convertJsonToDtTable(data, f_name, col_name, title_name) {
    let dataArray = []
    firstRow = title_name.concat({ role: 'style' })
    dataArray.push(firstRow)
    for (let i = 0; i <= 10; i++) {
        dataArray.push([col_name[i], data[f_name[i]], colors[i]])
    }

    const dataTable = google.visualization.arrayToDataTable(dataArray);
    return dataTable
}

function objectToString(data) {
    const result = data.map((el) => {
        const values = Object.values(el)
        return values.join(" - ")
    })
    return result
}

function renderResults(results, searchWrapper, resultsWrapper) {
    if (!results.length) {
        return searchWrapper.classList.remove('show')
    }
    const content = results
        .map((item) => {
            return `<li>${item}</li>`
        })
        .join('')

    $(searchWrapper).addClass('show')
    resultsWrapper.innerHTML = `<ul>${content}</ul>`
}

//Upload data to tabel
function uploadData(data, table) {
    let content = ""
    if (data == null) {
        $('.wrapper_table').css("display", "none")
        $('#btn-download').css("visibility", "hidden")
        return false
    }

    data.map((el) => {
        let temp = `<tr>
        <td>${el._id}</td>
        <td>${el.HocKy}</td>
        <td>${el.MaKhoa}</td>
        <td>${el.HoTenGV}</td>
        <td>${el.MaMH}</td>
        <td>${el.TenMH}</td>
        <td>${el.MaLop}</td>
        <td>${el.SLDK}</td>
        <td>${formatDate(new Date(el.LastUpdate))}</td>
    </tr>
    `
        content += temp
    })
    table.html(content)
    $('.wrapper_table').css("display", "inline-block")
    $('#btn-download').css("visibility", "visible")
    return true
}

//popup toggle
function openPopup(data) {
    //Show popup
    let height_popup = $(document).height()
    console.log(height_popup)
    $('.popup').css('height', `${height_popup}`)
    $('.popup').addClass('open-popup')
    $('#popup-detail').addClass('show-popup-content')

    //Fill data popup
    let input_rows = $('.row input')
    $('#popup-detail h3').text(`Object ID: ${data['_id']}`)
    $('#popup-edit h3').text(`Edit object ID: ${data['_id']}`)
    $('.btn-above h3').text("Last update:   " + formatDate(new Date(data['LastUpdate'])))

    const keys = Object.keys(data).slice(1, -2)
    for (let i = 0; i <= 22; i = i + 22) {
        keys.map((element, index) => {
            input_rows[i + index].value = data[element]
        })
    }

    //Prevent people type in input
    input_rows.prop('readOnly', true)
}

function closePopup() {
    $('.popup').removeClass('open-popup')
    $('.popup-content').removeClass('show-popup-content')
}

function getJsonDataFromPopup(objectT) {
    //Deep copy
    let res = { ...objectT }

    const input_rows = $('#popup-edit .row input')
    const keys = Object.keys(objectT).slice(1, -2)

    //fields have number type
    const keys_number = Array.from({ length: 11 }, (_, i) => `Diem${i}_SL`)
    keys_number.push("HocKy", "SLD", "SLKD", "SLDK")

    keys.map((element, index) => {
        res[element] = input_rows[index].value
    })

    //convert numerical fields have string data to int 
    keys_number.map((key) => {
        res[key] = parseInt(res[key])
    })

    return res
}

function checkObject(a, b) {
    return (JSON.stringify(a) === JSON.stringify(b))
}

// Convert string to ArrayBuffer
function s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
}

$(document).ready(async function () {

    /*Data table*/
    let data = []

    /*table variable*/
    const tbody = $('tbody')

    /*popup*/
    const popupDetail = $('#popup-detail')
    const popupEdit = $('#popup-edit')

    /*popup*/
    let objectTemp = {}

    /*Search box*/
    let searchable = [
        'Elastic',
        'PHP',
        'Something about CSS',
        'How to code',
        'JavaScript',
        'Coding',
        'Some other item',
    ]

    //Query to fetch
    var query = ["", "", "", ""]
    //query[0]: MaMH
    //query[1]: MaGV
    //query[2]: HocKy
    //query[3]: MaLop
    //query[4]: _id
    var queryString = ""

    var searchInput = $('#searchType1')
    var searchWrapper = $('#wrapper1')
    var resultsWrapper = $('#results1')

    //Update table each fields
    $('.searchType').click(async function () {
        searchable = []
        searchInput = this
        const id = Number($(this).attr('id').slice(-1))
        query[id - 1] = ""
        searchWrapper = $(`#wrapper${id.toString()}`)[0]
        resultsWrapper = $(`#results${id.toString()}`)[0]
        $('.results ul').empty()

        queryString = query.filter((el) => el != "").join("&")
        if (id == 1) {
            searchable = objectToString(await getJsonData(url_MaMH + queryString))
        }
        else if (id == 2) {
            searchable = objectToString(await getJsonData(url_MaGV + queryString))
        }
        else if (id == 3) {
            searchable = await getJsonData(url_HocKy + queryString)
        }
        else if(id == 4){
            searchable = await getJsonData(url_MaLop + queryString)
        }

        if (this.value == "")
            renderResults(searchable, searchWrapper, resultsWrapper)
    })

    $('.searchType').keyup(function () {
        let results = []
        const id = $(this).attr('id')
        let input = this.value

        if (input.length) {
            results = searchable.filter((item) => {
                return item.toLowerCase().includes(input.toLowerCase())
            })
        } else {
            results = searchable
        }

        renderResults(results, searchWrapper, resultsWrapper)
    })

    $(document).on('click', 'li', function () {
        const value = $(this).text()
        searchInput.value = value
        $(searchWrapper).removeClass('show')
    })

    //Update query
    $('.wrapper').mouseleave(function () {
        const value = searchInput.value
        const id = Number($(searchInput).attr('id').slice(-1)) - 1
        if (value != "" && value != null) {
            ma = value.split(" - ")[0]
            if (id == 0) {
                query[id] = `MaMH=${ma}`
            }
            else if (id == 1) {
                query[id] = `MaGV=${ma}`
            }
            else if (id == 2) {
                query[id] = `HocKy=${value}`
            }
            else if(id==3){
                query[id] = `MaLop=${value}`
            }
            else{
                query[id] = `_id=${value}`
            }
        }
        else
            query[id] = ""
        $(searchWrapper).removeClass('show')
    })

    $('.results').mouseleave(function () {
        $(searchWrapper).removeClass('show')
    })

    //click to create table
    $('#btn-search').click(async function () {
        queryString = query.filter((el) => el != "").join("&")
        data = await getJsonData(url_Classes + queryString)
        uploadData(data, tbody)
    })

    $('tbody').on('click', 'tr', function () {
        // Get the index of the clicked child div
        const index = $(this).index()
        objectTemp = data[index]
        openPopup(objectTemp)
    })

    $('#popup-detail .btn-exit').click(function () {
        closePopup()
    }
    )

    $('#popup-edit #btn-cancel').click(function () {
        closePopup()
        popupEdit.removeClass('show-popup-content')
    })

    $('#popup-detail #btn-edit').click(function () {
        popupDetail.removeClass('show-popup-content')
        popupEdit.addClass('show-popup-content')
        // $('#popup-edit .row input').map((el)=>el.readOnly=false)
        let inputs = $('#popup-edit .row input')
        inputs.prop('readOnly', false)
        inputs[0].focus()
    })

    $('#popup-edit .btn-exit').click(function () {
        let objectEdit = getJsonDataFromPopup(objectTemp)
        if (!checkObject(objectEdit, objectTemp)) {
            swal({
                title: "Warning!",
                text: "Please save your data before exit!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ['Save data', 'Exit']
            })
                .then((exit) => {
                    if (exit) {
                        popupEdit.removeClass('show-popup-content')
                        closePopup()
                    }
                })
        }
        else {
            popupEdit.removeClass('show-popup-content')
            closePopup()
        }
    })

    $('#popup-detail #btn-delete').click(async function () {
        swal({
            text: 'Type object ID you want to delete:',
            content: "input",
            button: {
                text: "Delete",
                closeModal: false,
            },
        })
            .then(async function (id) {
                if (id.trim() === objectTemp['_id']) {
                    swal({
                        title: "Congratulations!",
                        text: "Object is deleted",
                        icon: "success",
                        button: "OK",
                    })

                    fetch("http://localhost:3000/api/v1/classes/?_id=" + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(response => response.json())
                        .then(res => console.log("Success: ", res))
                        .catch(err => console.log(err))

                    closePopup()

                    //Update data table
                    data = await getJsonData(url_Classes + queryString)
                    uploadData(data, tbody)
                }
                else {
                    swal({
                        title: "Error!",
                        text: "Object ID is not matched. Please check again!\nMake sure that's object you want to delete.",
                        icon: "error",
                        button: "OK",
                    })
                }
            })
    })

    $('#popup-edit #btn-save').click(async function () {
        let objectEdit = getJsonDataFromPopup(objectTemp)
        // console.log(objectEdit)
        if (!checkObject(objectEdit, objectTemp)) {
            swal({
                text: 'Type object ID you want to update:',
                content: "input",
                button: {
                    text: "Update",
                    closeModal: false,
                },
            })
                .then(async function (id) {
                    if (id.trim() === objectTemp['_id']) {
                        objectEdit.LastUpdate = new Date().toISOString()
                        fetch("http://localhost:3000/api/v1/classes/?_id=" + id, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(objectEdit),
                        }).then(response => response.json())
                            .then(res => console.log("Success: ", res))
                            .catch(err => console.log(err))

                        closePopup()

                        swal({
                            title: "Congratulations!",
                            text: "Update object\'s data successfully.",
                            icon: "success",
                            button: "OK",
                        })

                        //Update data table
                        data = await getJsonData(url_Classes + queryString)
                        uploadData(data, tbody)
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: "Object ID is not matched. Please check again!\nMake sure that's object you want to delete.",
                            icon: "error",
                            button: "OK",
                        })
                    }
                })
        }
    })

    $("#btn-download").on("click", function () {
        //prepare data file which be downloaded
        fieldsToExclude = ['_id']
        data_file = data.map((obj) => {
            const newObj = {};
            for (const key in obj) {
                if (!fieldsToExclude.includes(key)) {
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        });

        console.log('click btn-download')
        const filename = "reports.xlsx" // Set the desired filename
        const ws = XLSX.utils.json_to_sheet(data_file)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "class")

        // Generate a Blob from the workbook
        const blob = new Blob([s2ab(XLSX.write(wb, { bookType: "xlsx", type: "binary" }))], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })

        // Create a download link and trigger the download
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
    })
})
