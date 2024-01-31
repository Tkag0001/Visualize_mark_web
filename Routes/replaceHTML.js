module.exports = function(template, listMarks, dataBarChart, dataPieChart) {
    let output = template.replace('{{%dataBarChart%}}', "[" + dataBarChart + "]");
    output = output.replace('{{%dataPieChart%}}', "[" + dataPieChart + "]")

    output = output.replace('{{%CONTENT%}}', `Phổ điểm môn: ${listMarks['TenMH']}<br>Lớp: ${listMarks['MaLop']}<br>Khoa: ${listMarks['Khoa']}<br>Học kì: ${listMarks['HocKy']}<br>Giảng viên: ${listMarks['HoTenGV']}`)
    return output
}