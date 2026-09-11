let currentPage = 1;
const itemsPerPage = 7;
let animalData = [];
let filteredData = []; // เพิ่มตัวแปรนี้เพื่อใช้สำหรับการค้นหา

async function fetchAnimalData() {
    try {
        const response = await axios.get('http://localhost:3000/animal/getAnimals');
        animalData = response.data;
        filteredData = animalData;
        displayPage(currentPage);
        updatePagination();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayPage(page) {
    const tableBody = document.querySelector('#animalTable tbody');
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">ไม่พบข้อมูล</td></tr>`;
    } else {
        paginatedData.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.AnimalID}</td>
                <td>${animal.Species}</td>
                <td>${animal.Nickname}</td>
                <td>${animal.Gender}</td>
                <td>${animal.ZoneName}</td>
                <td>
                    <button class="viewButton"
                        style="background-color:#201f1f; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
                        onclick="viewAnimal('${animal.AnimalID}')"
                        data-tooltip="Details of ${truncateText(animal.Nickname, 10)}">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

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
            displayPage(currentPage);
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
        displayPage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
});

function searchAnimal() {
    const searchQuery = document.querySelector('.searchBar input').value.trim().toLowerCase();
    const resultCount = document.querySelector('.resultCount');
    
    if (!animalData || animalData.length === 0) {
        console.error("ไม่มีข้อมูลสัตว์");
        return;
    }
    filteredData = animalData.filter(animal =>
        String(animal.AnimalID).toLowerCase().includes(searchQuery) ||
        String(animal.Species).toLowerCase().includes(searchQuery) ||
        String(animal.Nickname).toLowerCase().includes(searchQuery) ||
        String(animal.ZoneName).toLowerCase().includes(searchQuery)
    );
    currentPage = 1;
    resultCount.textContent = `${filteredData.length}`;
    displayPage(currentPage);
}
document.querySelector('.searchBar input').addEventListener('input', searchAnimal);
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
function viewAnimal(animalID) {
    window.location.href = `viewData.html?id=${animalID}`;
}
window.onload = fetchAnimalData;


function goToInsert(){
    window.location.href = 'insertAnimal.html';
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