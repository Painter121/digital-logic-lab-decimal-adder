let currentPage = 1;
const itemsPerPage = 7;
let animalCareData = [];
let filteredAnimalCareData = [];

// ดึงข้อมูลจาก API
async function getAnimalCare() {
    try {
        const response = await axios.get('http://localhost:3000/animalcare/getAnimalcare');
        animalCareData = response.data;
        filteredAnimalCareData = animalCareData; // เริ่มต้นแสดงข้อมูลทั้งหมด
        displayAnimalCarePage(currentPage);
        updateAnimalCarePagination();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// แสดงข้อมูลตามหน้าที่เลือก
function displayAnimalCarePage(page) {
    const tableBody = document.querySelector('#animalCareTable tbody');
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredAnimalCareData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">ไม่พบข้อมูล</td></tr>`;
    } else {
        paginatedData.forEach(animalCare => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animalCare.Employees}</td>
                <td>${animalCare.Animals} (${animalCare.Nickname})</td>
                <td>${animalCare.ZoneName}</td>
                <td>${formatDate(animalCare.DateOfCare)}</td>
                <td>
                    <button class="DeleteButton" style="background-color:rgb(190, 54, 54); color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
                        onclick="DeleteRelation('${animalCare.AnimalID}', '${animalCare.EmployeeID}', '${animalCare.Animals}', '${animalCare.Employees}', '${animalCare.Nickname}')"
                        data-tooltip="Delete Relation">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>`;
            tableBody.appendChild(row);
        });
    }

    updateAnimalCarePagination();
}

// อัปเดตการแบ่งหน้า
function updateAnimalCarePagination() {
    const totalPages = Math.ceil(filteredAnimalCareData.length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.style.display = totalPages > 1 ? 'flex' : 'none'; // ซ่อน pagination เมื่อมีเพียง 1 หน้า หรือไม่มีข้อมูล

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageNumbers.innerHTML = "";
    if (totalPages > 0) {
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('div');
            pageNumber.classList.add('page-number');
            if (i === currentPage) pageNumber.classList.add('active');
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                displayAnimalCarePage(currentPage);
            });
            pageNumbers.appendChild(pageNumber);
        }
    }
}

// ปุ่มเปลี่ยนหน้า
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayAnimalCarePage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredAnimalCareData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayAnimalCarePage(currentPage);
    }
});

// ค้นหาข้อมูล
function searchAnimalCare() {
    const searchQuery = document.querySelector('.searchBar input').value.trim().toLowerCase();
    const resultCount = document.querySelector('.resultCount');
    currentPage = 1; // รีเซ็ตไปหน้าที่ 1 ทุกครั้งที่ค้นหา

    if (!searchQuery) {
        filteredAnimalCareData = animalCareData; // ถ้าไม่มีข้อความค้นหา ให้แสดงข้อมูลทั้งหมด
    } else {
        filteredAnimalCareData = animalCareData.filter(animalCare => {
            const formattedDate = formatDateForSearch(animalCare.DateOfCare);
            return (
                String(animalCare.Nickname).toLowerCase().includes(searchQuery) ||
                String(animalCare.Employees).toLowerCase().includes(searchQuery) ||
                String(animalCare.Animals).toLowerCase().includes(searchQuery) ||
                String(animalCare.ZoneName).toLowerCase().includes(searchQuery) ||
                formattedDate.includes(searchQuery)
            );
        });
    }

    resultCount.textContent = `${filteredAnimalCareData.length}`;
    displayAnimalCarePage(currentPage);
    updateAnimalCarePagination();
}

// ตรวจสอบการค้นหาเมื่อพิมพ์
document.querySelector('.searchBar input').addEventListener('input', searchAnimalCare);

// แปลงวันที่สำหรับค้นหา
function formatDateForSearch(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ตัดข้อความ
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}



function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

window.onload = getAnimalCare;

function goToInsert() {
    window.location.href = 'insertAnimalCare.html';
}

function DeleteRelation(AnimalID, EmployeeID , animalName, EmployeeName , animalNickname) {
    const modal = document.getElementById('deleteModal');
    const confirmCheckbox = document.getElementById('confirmCheckbox');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    document.getElementById('Relation').innerHTML = ` ${EmployeeName} --- ${animalName} (${animalNickname})`

    // เปิด Modal
    modal.style.display = 'flex';

    confirmCheckbox.checked = false;
    confirmButton.classList.remove('enabled');
    confirmButton.disabled = true;

    // ลบ Event Listeners เก่าก่อนเพิ่มใหม่
    const newCheckboxListener = () => {
        const isChecked = confirmCheckbox.checked;
        confirmButton.disabled = !isChecked;
        if (isChecked) {
            confirmButton.classList.add('enabled');
        } else {
            confirmButton.classList.remove('enabled');
        }
    };

    const newCancelListener = () => {
        modal.style.display = 'none';
        // ลบ Event Listeners เพื่อป้องกันซ้ำ
        confirmCheckbox.removeEventListener('change', newCheckboxListener);
        cancelButton.removeEventListener('click', newCancelListener);
        confirmButton.removeEventListener('click', newConfirmListener);
    };

    const newConfirmListener = async () => {
        modal.style.display = 'none';
        try {
            const response = await axios.delete(`http://localhost:3000/animalcare/deleteAnimalCare/${AnimalID}/${EmployeeID}`);

            if (response.status === 200) {
                alert('Deleted successfully!');
                location.reload();
            } else {
                alert('Failed to delete the record. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
            } else {
                alert('Error: Network error or server is down. Please try again later.');
            }
        }
        // ลบ Event Listeners เพื่อป้องกันซ้ำ
        confirmCheckbox.removeEventListener('change', newCheckboxListener);
        cancelButton.removeEventListener('click', newCancelListener);
        confirmButton.removeEventListener('click', newConfirmListener);
    };

    confirmCheckbox.addEventListener('change', newCheckboxListener);
    cancelButton.addEventListener('click', newCancelListener);
    confirmButton.addEventListener('click', newConfirmListener);
}





// function searchAnimalcare() {
//     const searchQuery = document.querySelector('.searchBar input').value.toLowerCase();
//     const rows = document.querySelectorAll('#animalCareTable tbody tr');
//     let count = 0;

//     rows.forEach(row => {
//         const animal = row.getAttribute('data-Animal').toLowerCase();
//         const employee = row.getAttribute('data-Employee').toLowerCase();
//         const dateOfCare = formatDateForSearch(row.getAttribute('data-DateOfCare'));
//         const zoneName = row.getAttribute('data-ZoneName').toLowerCase();
//         const nickname = row.querySelector('td:nth-child(2)').textContent.split('(')[1]?.replace(')', '').toLowerCase() || '';

//         if (animal.includes(searchQuery) || employee.includes(searchQuery) || dateOfCare.includes(searchQuery) || zoneName.includes(searchQuery) || nickname.includes(searchQuery)) {
//             row.style.display = ''; 
//             count++; 
//         } else {
//             row.style.display = 'none';
//         }
//     });

//     const resultCount = document.querySelector('.resultCount');
//     resultCount.textContent = `${count}`; 
// }

// function formatDateForSearch(isoString) {
//     const date = new Date(isoString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); 
//     const year = date.getFullYear();

//     return `${day}/${month}/${year}`;
// }

// // ฟังก์ชัน searchAnimalcare เมื่อมีการพิมพ์ข้อความ
// document.querySelector('.searchBar input').addEventListener('input', searchAnimalcare);  

// ฟังก์ชันสร้าง Tooltip
function createTooltip(text, x, y) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    document.body.appendChild(tooltip);
    return tooltip;
}

// ฟังก์ชันลบ Tooltip
function removeTooltip(tooltip) {
    if (tooltip) {
        tooltip.remove();
    }
}

// เพิ่ม Event Listener สำหรับปุ่ม "View"
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.DeleteButton')) {
        const button = e.target.closest('.DeleteButton');
        const tooltipText = button.getAttribute('data-tooltip');
        const rect = button.getBoundingClientRect();

        // สร้าง Tooltip
        const tooltip = createTooltip(tooltipText, rect.left + rect.width / 2, rect.top - 30);

        // ลบ Tooltip เมื่อเลิก hover
        button.addEventListener('mouseleave', () => {
            removeTooltip(tooltip);
        }, { once: true }); // ใช้ { once: true } เพื่อลบ Event Listener หลังจากทำงานครั้งเดียว
    }
});


