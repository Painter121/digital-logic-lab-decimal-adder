//ตัดข้อความ
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

let currentPage = 1;
const itemsPerPage = 7;
let visitorData = [];

async function getVisitors() {
    try {
        const response = await axios.get('http://localhost:3000/User/getAllUser');
        visitorData = response.data;
        displayVisitorPage(currentPage);
        updateVisitorPagination();
    } catch (error) {
        console.error('Error fetching visitor data:', error);
        alert('Error fetching visitor data. Please try again later.');
    }
}

function displayVisitorPage(page) {
    const tableBody = document.querySelector('#VisitorDetailsTable tbody');
    tableBody.innerHTML = "";

    const filteredData = searchUser(false);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">ไม่พบข้อมูล</td></tr>';
        return;
    }

    paginatedData.forEach(user => {
        const formattedDOB = formatDate(user.DateOfBirth);
        const truncatedUser = truncateText(user.Username, 14);
        const role = (user.Role === 'Admin' || user.Role === 'User') ? user.Role : 'User';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.UserID || '-'}</td>
            <td>${user.Firstname} ${user.Lastname}</td>
            <td>${user.Username || '-'}</td>
            <td>${user.Email || '-'}</td>
            <td>${formattedDOB}</td>
            <td>${user.Gender || '-'}</td>
            <td>
                <button class="role-button" onclick="openRoleModal('${user.UserID}', '${user.Role}')" 
                        data-tooltip="Edit role for ${truncatedUser}">
                    ${role}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateVisitorPagination();
}

function updateVisitorPagination() {
    const totalPages = Math.ceil(searchUser(false).length / itemsPerPage);
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
            displayVisitorPage(currentPage);
        });
        return pageNumber;
    }

    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.appendChild(createPageNumber(i));
        }
    } else {
        pageNumbers.appendChild(createPageNumber(1));
        if (currentPage > 3) {
            pageNumbers.appendChild(document.createTextNode("..."));
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.appendChild(createPageNumber(i));
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.appendChild(document.createTextNode("..."));
        }
        pageNumbers.appendChild(createPageNumber(totalPages));
    }
}

function searchUser(update = true) {
    const searchQuery = document.querySelector('.searchBar input').value.trim().toLowerCase();
    if (!visitorData || visitorData.length === 0) return [];

    const filteredData = visitorData.filter(user =>
        String(user.UserID).toLowerCase().includes(searchQuery) ||
        String(user.Firstname).toLowerCase().includes(searchQuery) ||
        String(user.Lastname).toLowerCase().includes(searchQuery) ||
        `${user.Firstname} ${user.Lastname}`.toLowerCase().includes(searchQuery) ||
        String(user.Username).toLowerCase().includes(searchQuery) ||
        String(user.Email).toLowerCase().includes(searchQuery) ||
        String(user.Role).toLowerCase().includes(searchQuery)
    );

    document.querySelector('.resultCount').textContent = `${filteredData.length}`;

    if (update) {
        currentPage = 1;
        displayVisitorPage(currentPage);
    }

    document.querySelector('.pagination').style.display = searchQuery ? 'none' : 'flex';

    return filteredData;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayVisitorPage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(searchUser(false).length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayVisitorPage(currentPage);
    }
});

document.querySelector('.searchBar input').addEventListener('input', () => searchUser());

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ต้อง +1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}



document.addEventListener('DOMContentLoaded', () => {
    // console.log('Visitor Detail JS Loaded'); 
    getVisitors();
});

// เปิด Modal และกำหนดค่า Role
function openRoleModal(userId, currentRole) {
    document.getElementById('modalUserId').value = userId;
    document.getElementById('modalRole').value = currentRole;
    document.getElementById('roleModal').style.display = 'block';
}

// ปิด Modal
function closeRoleModal() {
    document.getElementById('roleModal').style.display = 'none';
}

// ฟังก์ชันแสดง Modal
function saveRoleChange() {
    const userId = document.getElementById('modalUserId').value;
    const newRole = document.getElementById('modalRole').value;
    
    const row = [...document.querySelectorAll('#VisitorDetailsTable tbody tr')]
        .find(tr => tr.children[0].textContent.trim() === userId);
    
    const username = row ? row.children[2].textContent.trim() : 'this user';

    document.getElementById('confirmMessage').textContent = `Are you sure you want to change the role of '${username}' to '${newRole}'?`;
    document.getElementById('confirmUserId').value = userId;
    document.getElementById('confirmNewRole').value = newRole;

    document.getElementById('confirmModal').style.display = 'block';
}



// ฟังก์ชันยืนยันการเปลี่ยนแปลง Role
async function confirmRoleChange() {
    const userId = document.getElementById('confirmUserId').value;
    const newRole = document.getElementById('confirmNewRole').value;

    try {
        const response = await axios.post('http://localhost:3000/User/updateRole', { userId, role: newRole });

        if (response.status === 200) {
            alert('Role updated successfully');
            closeConfirmModal();
            window.location.reload();
        } else {
            alert('Failed to update role. Please try again.');
        }
    } catch (error) {
        if(error.response.data.error === 'Admin role cannot be changed'){
            alert("Admin role cannot be changed");
        }else{
            console.error('Error updating role:', error);
        alert('Error updating role. Please try again.');
        }
    }
}

// ฟังก์ชันปิด Modal
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}




// // ค้นหาผู้ใช้ในตาราง
// function searchUser() {
//     const searchQuery = document.querySelector('.searchBar input').value.toLowerCase();
//     const rows = document.querySelectorAll('#VisitorDetailsTable tbody tr');
//     let count = 0;
//     rows.forEach(row => {
//         const userData = [
//             row.children[0].textContent.toLowerCase(),
//             row.children[1].textContent.toLowerCase(),
//             row.children[2].textContent.toLowerCase(),
//             row.children[3].textContent.toLowerCase(),
//             // row.children[4].textContent.toLowerCase(),
//             row.children[6].textContent.toLowerCase()
//         ];
        
//         if (userData.some(field => field.includes(searchQuery))) {
//             row.style.display = '';
//             count++;
//         } else {
//             row.style.display = 'none';
//         }
//     });

//     document.querySelector('.resultCount').textContent = `${count}`;
// }

// document.querySelector('.searchBar input').addEventListener('input', searchUser);


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
    if (e.target.closest('.role-button')) {
        const button = e.target.closest('.role-button');
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