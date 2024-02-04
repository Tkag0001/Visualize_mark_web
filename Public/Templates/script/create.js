function uploadFile(data, table) {
    let content = "";
    for (let el of data) {
        let temp = `<tr>
        <td>${el.HocKy}</td>
        <td>${el.MaKhoa}</td>
        <td>${el.HoTenGV}</td>
        <td>${el.MaMH}</td>
        <td>${el.TenMH}</td>
        <td>${el.MaLop}</td>
        <td>${el.SLDK}</td>
        <td>${el.SLD}</td>
        <td>${el.SLKD}</td>
    </tr>
    `;
        if (temp.indexOf('undefined') !== -1) {
            $('.wrapper_table').css("display", "none");
            alert('Can\'t read undefined');
            return false;  // This will exit the function
        } else {
            content += temp;
        }
    }
    table.html(content);
    $('.wrapper_table').css("display", "inline-block");
    return true
}

function uploadDb(data) {
    console.log(data)
    fetch("https://odd-ruby-trout-cap.cyclic.app/api/v1/classes/?", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(err => {
            console.log(err)
            alert('Upload is false!')
        });
}

$(document).ready(function () {
    const form = $('form')
    const fileInput = $(".file-input")
    const tbody = $('tbody')
    var listObjects = []
    var uploadF = false

    console.log(form)
    console.log(tbody)
    fileInput.click(function (event) {
        console.log("file input click")
        event.stopPropagation()
    })

    form.click(function () {
        console.log('form click')
        fileInput.click()
    })


    fileInput.click(function () { console.log('click input') })
    fileInput.change(function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let objects = XLSX.utils.sheet_to_json(sheet);

            // Decode HTML entities in the data
            objects = objects.map(item => {
                for (let key in item) {
                    item[key] = he.decode(item[key]);
                }
                return item;
            });
            listObjects = objects

            uploadF = uploadFile(listObjects, tbody)
        };
        reader.readAsArrayBuffer(file);
    });

    $('#pushDb').click(function (event) {
        // console.log('push')
        if (!uploadF) {
            alert('Data is invalid!')
        }
        else {
            const result = confirm('Are you sure you want to upload data?')
            if (result == false) {
                console.log('cancel upload')
                event.preventDefault()
            }
            else {
                console.log(listObjects)
                console.log('upload database')
                uploadDb(listObjects)
            }
        }

    })

})

const data = {
    // your JSON data here
};

// fetch('http://your-server-url/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
// })
// .then(response => response.json())
// .then(data => console.log('Success:', data))
// .catch((error) => console.error('Error:', error));
