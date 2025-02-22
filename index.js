let global=[];
let customerDB=[];
let sortDirection = {};
petList=document.getElementById("petList");
const addCustomer=()=>{
    const addDetails ={
        id:`${Date.now()}`,
        customer_name:document.getElementById("customer_name").value,
        gender:document.getElementById("gender").value,
        emailid:document.getElementById("emailid").value,
        phoneNumber:document.getElementById("phoneNumber").value,
        service:document.getElementById("service").value,
        price:document.getElementById("price").value,
        clientof:document.getElementById("clientof").value,
    };
    // petList.insertAdjacentHTML('beforeend',generateCard(addDetails));
    global.push(addDetails);
    
    saveToLocal();
    document.getElementById("customer_name").value="";
    document.getElementById("gender").value="";
    document.getElementById("emailid").value="";
    document.getElementById("phoneNumber").value="";
    document.getElementById("service").value="";
    document.getElementById("price").value="";
    document.getElementById("clientof").value="";
}

// const generateCard= ({customer_name,id,emailid,phoneNumber,service,price,clientof}) =>{
//     return (`
//             <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
//                 <div class="card">
//                 <a style="display:none">${customer_name}</a>
//                     <div class="card-header">
//                         <div class="card-header d-flex justify-content-between">
//                             <div>
//                             <h2>${phoneNumber}</h2>
//                             </div>
//                             <div class="d-flex justify-content-between">
//                                 <button type="button" class="btn btn-outline-info" onclick="updateCard(${id})" data-bs-toggle="modal" data-bs-target="#edit">
//                                     <i class="fas fa-pencil-alt"></i>
//                                 </button>
//                                 <button type="button" class="btn btn-outline-danger ms-2" onclick="deleteDetail(${id})">
//                                         <i class="far fa-trash-alt"></i>
//                                 </button>
//                                 <a type="button" class="btn btn-outline-success ms-2" href="https://api.whatsapp.com/send?text=Hello guys this is my online pet store.Visit now @ https://condescending-meitner-e132cf.netlify.app/">
//                                     <i class="fas fa-share pt-2"></i>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="card-body" style="display:flex;justify-content:space-evenly">
//                         <div>
//                             <h3>${customer_name}</h3>
//                             <h5>Status :&nbsp&nbsp<span class="badge bg-success">${service}</span></h5>
//                             <h5>Status :&nbsp&nbsp<span class="badge bg-success">${clientof}</span></h5>
//                             <h5>Status :&nbsp&nbsp<span class="badge bg-success">${emailid}</span></h5>
//                             <h5>Price : &nbsp&nbsp$ ${price}</h5>
//                         </div>
                        
//                     </div>
//                     <div class="card-footer">
//                         <button type="button" onclick="viewSend(${id})" class="btn btn-outline-primary float-end" data-toggle="modal" data-target="#exampleModalCenter">
//                             View Details
//                         </button>
//                     </div>
//                 </div>
//             </div>`)
//         }
const saveToLocal=()=>
{
    localStorage.setItem("customer",JSON.stringify({items:global}));
}
// const reloadCard=()=>{
//     const temp=JSON.parse(localStorage.getItem("customer"));
//     if(temp)
//     {
//         global=temp["items"]
//     }
//     global.map((cardDetail)=>{
//         petList.insertAdjacentHTML('beforeend',generateCard(cardDetail));
//     });
// }
// Delete card
// const deleteDetail =(e) =>{
//     global.forEach((item)=>{
//         const index = global.indexOf(item);
//             if(item.id==e)
//             {
//                 console.log(item);
//                 global.splice(index,1);
//             }
//     })
//     saveToLocal();
//     window.location.reload();
// }
const convertToCSV = () => 
{
    const temp=JSON.parse(localStorage.getItem("customer"));
    if(temp)
    {
        global=temp["items"]
    }
    const headers = Object.keys(global[0]).join(",") + "\n";
    const rows = global.map(obj => Object.values(obj).join(",")).join("\n");
    return headers + rows;
}
const downloadCSV = () =>
{
    const csvData = convertToCSV();
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById("download").addEventListener("click", downloadCSV);

const populateTable = (data) => {
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = ""; // Clear previous data

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(Number(item.id)).toLocaleDateString()}</td>
            <td>${item.customer_name}</td>
            <td>${item.emailid}</td>
            <td>${item.phoneNumber}</td>
            <td>₹${item.price}</td>
            <td>${item.service}</td>
            <td>${item.clientof}</td>  
        `;
        tableBody.appendChild(row);
    });
}
const calculateStatistics = () => 
{
    const monthlyTotals = {};
    const weeklyTotals = {};
    const temp=JSON.parse(localStorage.getItem("customer"));
    if(temp)
    {
        global=temp["items"]
    }
    populateTable(global);
    global.forEach(item => {
        const timestamp = Number(item.id); // Convert id (Date.now) to number
        const date = new Date(timestamp);
        
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // "2025-02"
        const yearWeek = `${date.getFullYear()}-W${getWeekNumber(date)}`; // "2025-W7"

        const price = Number(item.price);

        // Sum by month
        if (!monthlyTotals[yearMonth]) {
            monthlyTotals[yearMonth] = 0;
        }
        monthlyTotals[yearMonth] += price;

        // Sum by week
        if (!weeklyTotals[yearWeek]) {
            weeklyTotals[yearWeek] = 0;
        }
        weeklyTotals[yearWeek] += price;
        const monthly = document.getElementById("monthly_sales");
        monthly.innerHTML = "$"+monthlyTotals[yearMonth];
        const weekly = document.getElementById("weekly_sales");
        weekly.innerHTML = "$"+weeklyTotals[yearWeek];
    });
    
    
    return weeklyTotals;
}
const monthlyStats = calculateStatistics();

// Function to get the week number of the year
function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
}

function sortTable(columnIndex) {
    const table = document.getElementById("dataTable");
    let rows = Array.from(table.getElementsByTagName("tr"));

    // Toggle sort direction
    sortDirection[columnIndex] = !sortDirection[columnIndex];

    rows.sort((a, b) => {
        let cellA = a.cells[columnIndex].textContent.trim();
        let cellB = b.cells[columnIndex].textContent.trim();

        // Convert to numbers if applicable
        let numA = parseFloat(cellA.replace(/₹/, ""));
        let numB = parseFloat(cellB.replace(/₹/, ""));

        if (!isNaN(numA) && !isNaN(numB)) {
            return sortDirection[columnIndex] ? numA - numB : numB - numA;
        }

        return sortDirection[columnIndex] ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    // Remove existing rows and append sorted ones
    table.innerHTML = "";
    rows.forEach(row => table.appendChild(row));

    // Update sort direction indicators
    updateSortIndicators(columnIndex);
}

function updateSortIndicators(columnIndex) {
    document.querySelectorAll(".sortable").forEach((th, index) => {
        th.classList.remove("asc", "desc");
        if (index === columnIndex) {
            th.classList.add(sortDirection[columnIndex] ? "asc" : "desc");
        }
    });
}