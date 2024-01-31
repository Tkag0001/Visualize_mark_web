google.charts.load('current', { packages: ['corechart'] });
const url_MaMH = "https://odd-ruby-trout-cap.cyclic.app/v1/classes/monhoc/?"
const url_MaGV = "https://odd-ruby-trout-cap.cyclic.app/v1/classes/giaovien/?"
const url_HocKy = "https://odd-ruby-trout-cap.cyclic.app/v1/classes/hocky/?"
const url_Classes = "https://odd-ruby-trout-cap.cyclic.app/v1/classes/?"

async function getJsonData(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    if (jsonData.data.length != 0) {
        return jsonData.data;
    }
    else
        return null
}

function convertJsonToDtTable(data, f_name, col_name, title_name) {
    let dataArray = []
    dataArray.push(title_name)
    for (let i = f_name.length - 1; i >= 0; i--) {
        dataArray.push([col_name[i], data[f_name[i]]])
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

function drawChart(dataBarChart, dataPieChart) {
    // Set Options
    const options = {
        height: '400px',
        // width: '500px'
    };

    // Draw
    const barChart = new google.visualization.BarChart($('#myBarChart')[0]);
    barChart.draw(dataBarChart, options);

    const pieChart = new google.visualization.PieChart($('#myPieChart')[0]);
    pieChart.draw(dataPieChart, options);
}

function renderResults(results, searchWrapper, resultsWrapper) {
    if (!results.length) {
        return searchWrapper.classList.remove('show');
    }
    const content = results
        .map((item) => {
            return `<li>${item}</li>`;
        })
        .join('');

    $(searchWrapper).addClass('show');
    resultsWrapper.innerHTML = `<ul>${content}</ul>`;
}

f_name_group = Array.from({ length: 11 }, (_, i) => `Diem${i}_SL`)
f_name_group.push("SLD", "SLKD")
async function groupObject(data, f_name) {
    return data.reduce((acc, obj) => {
        f_name.map((f) => {
            if (acc.hasOwnProperty(f))
                acc[f] += obj[f]
            else
                acc[f] = obj[f]
        })
        return acc
    }, {})
}
$(document).ready(async function () {

    /*Search box*/
    let searchable = [
        'Elastic',
        'PHP',
        'Something about CSS',
        'How to code',
        'JavaScript',
        'Coding',
        'Some other item',
    ];

    //Query to fetch
    var query = ["", "", ""]
    //query[1]: MaMH
    //query[2]: MaGV
    //query[3]: HocKy
    var queryString = ""

    // var queryMaMH
    // var queryMaGV
    // var queryHocKy
    var searchData

    //Data fetched
    // var dataMaMH = objectToString(await getJsonData(url_MaMH))
    // var dataMaGv = objectToString(await getJsonData(url_MaGV))
    // dataMaGv = dataMaGv.filter((el) => el != " - ")
    // var dataHocKy = objectToString(await getJsonData(url_HocKy))

    var searchInput = $('#searchType1')
    var searchWrapper = $('#wrapper1')
    var resultsWrapper = $('#results1')

    $('.searchType').click(async function () {
        searchInput = this
        const id = Number($(this).attr('id').slice(-1))
        query[id - 1] = ""
        searchWrapper = $(`#wrapper${id.toString()}`)[0];
        resultsWrapper = $(`#results${id.toString()}`)[0];
        $('.results ul').empty()

        queryString = query.filter((el) => el != "").join("&")
        if (id == 1) {
            searchable = objectToString(await getJsonData(url_MaMH + queryString))
        }
        else if (id == 2) {
            searchable = objectToString(await getJsonData(url_MaGV + queryString))
        }
        else {
            let temp = await getJsonData(url_HocKy + queryString)
            searchable = await temp.map((el) => el.toString())
        }

        if (this.value == "")
            renderResults(searchable, searchWrapper, resultsWrapper);
    })

    $('.searchType').keyup(function () {
        let results = [];
        const id = $(this).attr('id')
        let input = this.value;
        // searchWrapper = $(`#wrapper${id.slice(-1)}`)[0];
        // resultsWrapper = $(`#results${id.slice(-1)}`)[0];

        if (input.length) {
            results = searchable.filter((item) => {
                return item.toLowerCase().includes(input.toLowerCase());
            });
        } else {
            results = searchable
        }

        renderResults(results, searchWrapper, resultsWrapper);
    })

    // $('.results').mouseleave(function () {
    // })

    $(document).on('click', 'li', function () {
        const value = $(this).text();
        searchInput.value = value;
        $(searchWrapper).removeClass('show');
    });

    $('.wrapper').mouseleave(function () {
        const value = searchInput.value;
        const id = Number($(searchInput).attr('id').slice(-1)) - 1
        if (value != "" && value!=null) {
            ma = value.split(" - ")[0]
            if (id == 0) {
                query[id] = `MaMH=${ma}`
            }
            else if (id == 1) {
                query[id] = `MaGV=${ma}`
            }
            else {
                query[id] = `HocKy=${value}`
            }
        }
        else
            query[id] = ""
        $(searchWrapper).removeClass('show');
    })

    $('.results').mouseleave(function () {
        $(searchWrapper).removeClass('show');
    })

    //Draw Chart
    const col_nameDiem = Array.from({ length: 11 }, (_, i) => `Điểm ${i}:`)
    const f_nameDiem = Array.from({ length: 11 }, (_, i) => `Diem${i}_SL`)
    const col_nameDau = ["Tỉ lệ không đậu", "Tỉ lệ đậu"]
    const f_nameDau = ["SLKD", "SLD"]
    const title_nameDiem = ["Điểm số", "Số lượng"]
    const title_nameDau = ["Đậu/Rớt", "Số lượng"]

    $('#btn-search').click(async function () {
        queryString = query.filter((el) => el != "").join("&")
        let data = await getJsonData(url_Classes + queryString)
        let dataChart = await groupObject(data, f_nameDiem.concat(f_nameDau))
        let dataBarChart = convertJsonToDtTable(dataChart, f_nameDiem, col_nameDiem, title_nameDiem)
        let dataPieChart = convertJsonToDtTable(dataChart, f_nameDau, col_nameDau, title_nameDau)
        drawChart(dataBarChart, dataPieChart)
    })

});