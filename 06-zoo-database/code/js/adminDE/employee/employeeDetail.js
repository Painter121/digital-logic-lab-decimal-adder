let currentPage = 1;
const itemsPerPage = 7;
let employeeData = [];
let filteredData = [];

async function getEmployee() {
    try {
        const response = await axios.get('http://localhost:3000/employee/getEmployee');
        employeeData = response.data;
        filteredData = employeeData;
        displayEmployeePage(currentPage);
        updateEmployeePagination();
    } catch (error) {
        console.error('Error fetching employee data:', error);
        alert('Error fetching employee data. Please try again later.');
    }
}

function displayEmployeePage(page) {
    const tableBody = document.querySelector('#EmployeeTable tbody');
    tableBody.innerHTML = "";

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">ไม่พบข้อมูล</td></tr>`;
    } else {
        paginatedData.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.EmployeeID}</td>
                <td>${employee.FirstName} ${employee.LastName}</td>
                <td>${employee.Position}</td>
                <td>${employee.Gender}</td>
                <td>${employee.ZoneName}</td>
                <td>
                    <button class="viewButton" style="background-color:#201f1f; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
                        onclick="viewEmployee('${employee.EmployeeID}')"
                        data-tooltip="Details of ${truncateText(employee.FirstName, 10)}">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    updateEmployeePagination();
}

function updateEmployeePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    pageNumbers.innerHTML = "";

    function createPageNumber(page) {
        const pageNumber = document.createElement('div');
        pageNumber.classList.add('page-number');
        if (page === currentPage) {
            pageNumber.classList.add('active');
        }
        pageNumber.textContent = page;
        pageNumber.addEventListener('click', () => {
            currentPage = page;
            displayEmployeePage(currentPage);
        });
        return pageNumber;
    }

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.appendChild(createPageNumber(i));
    }
}

function searchEmployee() {
    const searchQuery = document.querySelector('.searchBar input').value.trim().toLowerCase();
    currentPage = 1;

    filteredData = employeeData.filter(employee =>
        String(employee.EmployeeID).toLowerCase().includes(searchQuery) ||
        String(employee.FirstName).toLowerCase().includes(searchQuery) ||
        String(employee.LastName).toLowerCase().includes(searchQuery) ||
        `${employee.FirstName} ${employee.LastName}`.toLowerCase().includes(searchQuery) ||
        String(employee.Position).toLowerCase().includes(searchQuery) ||
        String(employee.ZoneName).toLowerCase().includes(searchQuery)
    );

    displayEmployeePage(currentPage);
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayEmployeePage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayEmployeePage(currentPage);
    }
});

document.querySelector('.searchBar input').addEventListener('input', searchEmployee);

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}


function viewEmployee(employeeID) {
    window.location.href = `viewEmployee.html?id=${employeeID}`;
}



function goToInsert() {
    window.location.href = 'insertEmployee.html';
}

window.onload = getEmployee;


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
    if (e.target.closest('.viewButton')) {
        const button = e.target.closest('.viewButton');
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
