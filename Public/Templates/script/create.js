// const XLSX = require('XLSX')
// const form = $('form')
// fileInput = $(".file-input")
// progressArea = $(".progress-area")
// uploadedArea = $(".uploaded-area")
// console.log(form)

// fileInput.onchange = ({target})=>{
//   let file = target.files[0];
//   if(file){
//     let fileName = file.name;
//     if(fileName.length >= 12){
//       let splitName = fileName.split('.');
//       fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
//     }
//     uploadFile(fileName);
//   }
// }

// function uploadFile(name){
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "php/upload.php");
//   xhr.upload.addEventListener("progress", ({loaded, total}) =>{
//     let fileLoaded = Math.floor((loaded / total) * 100);
//     let fileTotal = Math.floor(total / 1000);
//     let fileSize;
//     (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
//     let progressHTML = `<li class="row">
//                           <i class="fas fa-file-alt"></i>
//                           <div class="content">
//                             <div class="details">
//                               <span class="name">${name} • Uploading</span>
//                               <span class="percent">${fileLoaded}%</span>
//                             </div>
//                             <div class="progress-bar">
//                               <div class="progress" style="width: ${fileLoaded}%"></div>
//                             </div>
//                           </div>
//                         </li>`;
//     uploadedArea.addClass("onprogress");
//     progressArea.innerHTML = progressHTML;
//     if(loaded == total){
//       progressArea.innerHTML = "";
//       let uploadedHTML = `<li class="row">
//                             <div class="content upload">
//                               <i class="fas fa-file-alt"></i>
//                               <div class="details">
//                                 <span class="name">${name} • Uploaded</span>
//                                 <span class="size">${fileSize}</span>
//                               </div>
//                             </div>
//                             <i class="fas fa-check"></i>
//                           </li>`;
//       uploadedArea.removeClass("onprogress");
//       uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
//     }
//   });
//   let data = new FormData(form);
//   xhr.send(data);
// }
function uploadFile(data, table) {
    console.log(data)
    console.log(table)
    let content = ""
    data.map((el) => {
        content += `<tr>
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
    `
    })

    console.log(content)
    table.append(content)
    console.log(table.innerHTML)
    $('.wrapper_table').css("display", "inline-block")
}

$(document).ready(function () {
    const form = $('form')
    const fileInput = $(".file-input")
    const tbody = $('tbody')
    const progressArea = $(".progress-area")
    const uploadedArea = $(".uploaded-area")

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
    // fileInput.change((event) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         const data = event.target.result;
    //         const workbook = XLSX.read(data, { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         const listObject = XLSX.utils.sheet_to_json(sheet);
    //         console.log(listObject);
    //     };
    //     reader.readAsArrayBuffer(file);
    // });
    let listObjects = []

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
            listObjects.push(objects)

            uploadFile(listObjects[listObjects.length - 1], tbody)
        };
        reader.readAsArrayBuffer(file);

        console.log(listObjects);


    });
})