let currentPage = 1;
const itemsPerPage = 7;
let zoneData = [];
let filteredData = []; // เก็บข้อมูลหลังจากการค้นหา

async function getZone() {
    try {
        const response = await axios.get('http://localhost:3000/zone/getZoneList');
        zoneData = response.data;
        filteredData = zoneData;

        const hasIssue = zoneData.some(zone =>
            zone.RemainingAnimalCapacity < zone.AnimalCapacity &&
            zone.RemainingEmployeeCapacity === zone.EmployeeCapacity
        );
        if (hasIssue) {
            showNotification();
        }
        displayZonePage(currentPage);
        updateZonePagination();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayZonePage(page) {
    const tableBody = document.querySelector('#zoneTable tbody');
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">ไม่พบข้อมูล</td></tr>`;
    } else {
        paginatedData.forEach(zone => {
            const row = document.createElement('tr');
            let StatusAnimal = zone.RemainingAnimalCapacity === 0 ? "Full" :
                zone.RemainingAnimalCapacity === zone.AnimalCapacity ? "Empty" :
                    zone.RemainingAnimalCapacity;

            let StatusEmployee = zone.RemainingEmployeeCapacity === 0 ? "Full" :
                zone.RemainingEmployeeCapacity === zone.EmployeeCapacity ? "Empty" :
                    zone.RemainingEmployeeCapacity;

            if (StatusEmployee === "Empty" && StatusAnimal !== "Empty") {
                row.classList.add('highlight-red');
            }

            row.innerHTML = `
                <td>${zone.ZoneID}</td>
                <td>${zone.ZoneName}</td>
                <td>${zone.TotalCapacity}</td>
                <td>${StatusAnimal}</td>
                <td>${StatusEmployee}</td>
                <td>
                    <button class="viewButton"
                        style="background-color: #201f1f; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
                        onclick="viewZone('${zone.ZoneID}')"
                        data-tooltip="Details of ${truncateText(zone.ZoneName, 10)}">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    updateZonePagination();
}

function updateZonePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    pageNumbers.innerHTML = "";

    if (totalPages === 0) {
        document.querySelector('.pagination').style.display = 'none';
        return;
    } else {
        document.querySelector('.pagination').style.display = 'flex';
    }

    function createPageNumber(page) {
        const pageNumber = document.createElement('div');
        pageNumber.classList.add('page-number');
        if (page === currentPage) pageNumber.classList.add('active');
        pageNumber.textContent = page;
        pageNumber.addEventListener('click', () => {
            currentPage = page;
            displayZonePage(currentPage);
        });
        return pageNumber;
    }

    function createDots() {
        const dots = document.createElement('div');
        dots.textContent = "...";
        dots.classList.add('dots');
        return dots;
    }

    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.appendChild(createPageNumber(i));
        }
    } else {
        pageNumbers.appendChild(createPageNumber(1));
        if (currentPage > 3) pageNumbers.appendChild(createDots());
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.appendChild(createPageNumber(i));
        }
        if (currentPage < totalPages - 2) pageNumbers.appendChild(createDots());
        pageNumbers.appendChild(createPageNumber(totalPages));
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayZonePage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayZonePage(currentPage);
    }
});

function searchZone() {
    const searchQuery = document.querySelector('.searchBar input').value.trim().toLowerCase();
    const resultCount = document.querySelector('.resultCount');

    if (!zoneData || zoneData.length === 0) {
        console.error("ไม่มีข้อมูลโซน");
        return;
    }

    filteredData = zoneData.filter(zone =>
        String(zone.ZoneID).toLowerCase().includes(searchQuery) ||
        String(zone.ZoneName).toLowerCase().includes(searchQuery)
    );

    resultCount.textContent = `${filteredData.length}`;
    currentPage = 1; // รีเซ็ตไปหน้าที่ 1 ทุกครั้งที่ค้นหา
    displayZonePage(currentPage);
}

document.querySelector('.searchBar input').addEventListener('input', searchZone);

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
window.onload = getZone;


function viewZone(zoneID) {
    window.location.href = `../zone/viewZone.html?id=${zoneID}`;
}

function goToInsert() {
    window.location.href = 'insertZone.html';
}


function closeNotification() {
    document.getElementById("notification").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


function showNotification() {
    document.getElementById("notification").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}


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