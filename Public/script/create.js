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
            swal({
                title: "Error!",
                text: "Can't read underfined!",
                icon: "error",
                button: "Upload again!",
            });
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
    fetch("https://odd-ruby-trout-cap.cyclic.app/api/v1/classes/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            swal("Congratulations! Your data has been uploaded.", {
                icon: "success",
            })
            console.log("Success: ", data)
        })
        .catch(err => {
            console.log(err)
            swal({
                title: "Error!",
                text: "Upload fail",
                icon: "error", 
                button: "Upload again!",
            });
        });
}

const data = {
    // your JSON data here
};

//Check role of user
const getUser = (roles) => {
    fetch("https://odd-ruby-trout-cap.cyclic.app/api/v1/auth/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "auth_token": localStorage.getItem('auth-token') })
    }).then(response => response.json())
        .then(res => {
            console.log("Success: ", res)
            if (roles.includes(res.role))
                return res
            else {
                swal("You don't have permission", "Please change another account!", "error")
                    .then(function () {
                        window.location.replace('/home')
                    })

                return null
            }
        }
        )
        .catch(err => {
            console.log(err)
            window.location.replace('/login')
            return null
        })
}

$(document).ready(function () {
    //Checl role user
    var user = getUser(['teacher', 'administrator'])

    //Defind elements
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
            // alert('Data is invalid!')
            swal({
                title: "Error!",
                text: "Data is invalid",
                icon: "error",
                button: "Upload again!",
            });
        }
        else {
            // const result = confirm('Are you sure you want to upload data?')
            // if (result == false) {
            //     console.log('cancel upload')
            //     event.preventDefault()
            // }
            // else {
            //     console.log(listObjects)
            //     console.log('upload database')
            //     uploadDb(listObjects)
            // }

            swal({
                title: "Are you sure you want to upload data?",
                text: "You can't delete by yourself!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpload) => {
                    if (willUpload) {
                        // swal("Congratulations! Your data has been uploaded.", {
                        //     icon: "success",
                        // });
                        uploadDb(listObjects)
                    } else {
                        swal("Cancle data upload!");
                    }
                });
        }

    })

    $("#btn-info").click(function(){
        swal({
            title: "Note:",
            text: `Upload your file.
            If your file can't be uploaded, please check your data. Make sure your data matches the data types of the data fields!            
            
            String type: MaKhoa, Khoa, MaGV, HoTenGV, TenMH, MaMH, MaLop
            Number type: another
            
            Download template data here`,

            icon: "info",
            buttons: true,
            dangerMode: true,
            buttons:['Exit', 'Download template']
        })
        .then((willUpload)=>{
            if(willUpload){
                console.log('download')
                let link = $("<a></a>")
                link.attr("download", "template.xlsx")
                link.attr("href","../data/templateData.xlsx")

                console.log(link)
                $("body").append(link)
                link[0].click()
                link.remove()
            }
        })
    })

    $('#logout').click(async function(){
        localStorage.removeItem('auth-token')
        window.location.replace('/login')
    })
})

