
function containsSpecialCharacters(input) {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialChars.test(input);
}

function validateForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const position = document.getElementById('position').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const nationality = document.getElementById('nationality').value;

    if (containsSpecialCharacters(firstName)) {
        alert("First Name contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(lastName)) {
        alert("Last Name contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(position)) {
        alert("Position contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(phoneNumber)) {
        alert("Phone Number contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(nationality)) {
        alert("Nationality contains special characters.");
        return false;
    }

    return true;
}

async function getEmployeeDetails() {
    const params = new URLSearchParams(window.location.search);
    const employeeID = params.get('id');

    if (!employeeID) {
        alert("Employee ID is missing.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/employee/getEmployee/${employeeID}`);
        const employee = response.data;
        console.log(employee)

        // แปลงวันเกิดเป็นรูปแบบ
        const dateOfBirth = new Date(employee.DateOfBirth);
        const formattedDate = `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`;
        

        // เติมข้อมูลในฟอร์ม
        document.getElementById('employeeID').value = employee.EmployeeID;
        document.getElementById('firstName').value = employee.FirstName;
        document.getElementById('lastName').value = employee.LastName;
        document.getElementById('position').value = employee.Position;
        document.getElementById('phoneNumber').value = employee.PhoneNumber;
        document.getElementById('email').value = employee.Email;
        document.getElementById('dateOfBirth').value = formattedDate;
        document.getElementById('address').value = employee.Address;
        document.getElementById('gender').value = employee.Gender;
        document.getElementById('nationality').value = employee.Nationality;
        document.getElementById('zoneID').value = employee.ZoneName;

        document.getElementById('delete').addEventListener('click', function () {
            deleteData(employee.FirstName + ' ' + employee.LastName);
        });

    } catch (error) {
        console.error("Error fetching employee details:", error);
        alert("Failed to fetch employee details.");
    }
}

// เรียกใช้ฟังก์ชันเมื่อหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', getEmployeeDetails);




function selectZone(zoneID , zoneName) {
    document.getElementById('zoneID').dataset.zoneId = zoneID;
    document.getElementById('zoneID').value = zoneName; 
    document.getElementById('zoneModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}


document.getElementById('selectZoneBtn').addEventListener('click', function () {
    const modal = document.getElementById('zoneModal');
    modal.style.display = 'flex'; 
    document.body.classList.add('modal-open'); 

    axios.get('http://localhost:3000/zone/getCapacityZone')
        .then(response => {
            const zones = response.data;
            const zoneList = document.getElementById('zoneList');
            zoneList.innerHTML = '';

            const availableZones = zones.filter(zone => zone.RemainingCapacity > 0);

            availableZones.forEach(zone => {
                const zoneDiv = document.createElement('div');
                zoneDiv.className = 'zone-item';
                zoneDiv.style.border = '1px solid #ccc';
                zoneDiv.style.margin = '10px'; 
                zoneDiv.style.padding = '10px'; 
                zoneDiv.style.cursor = 'pointer'; 

                // <p><strong>Zone ID:</strong> ${zone.ZoneID}</p>
                zoneDiv.innerHTML = `
                    <p id = 'zoneName'>${zone.ZoneName}</p>
                    <p>พื้นที่เหลือ ${zone.RemainingCapacity}</p>
                `;

                zoneDiv.addEventListener('click', () => selectZone(zone.ZoneID , zone.ZoneName)); 
                zoneList.appendChild(zoneDiv);
            });
        })
        .catch(error => console.error('Error fetching zones:', error));
});


document.querySelector('.close').addEventListener('click', function () {
    const modal = document.getElementById('zoneModal');
    modal.style.display = 'none'; 
    document.body.classList.remove('modal-open'); 
});

window.onclick = function (event) {
    const modal = document.getElementById('zoneModal');
    if (event.target === modal) {
        modal.style.display = 'none'; 
        document.body.classList.remove('modal-open'); 
    }
};


function confirmUpdate(event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const form = document.getElementById('employeeForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const fName = document.getElementById('firstName').value
    const lName = document.getElementById('lastName').value
    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; 
    confirmButton.onclick = updateEmployee;

    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    // เปลี่ยนข้อความใน Confirm Box
    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Update";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#45a049";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to update "${fName} ${lName}"   ?`;
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#45a049";
    // ปิดการคลิกบน Overlay เท่านั้น
    document.getElementById('overlay').style.pointerEvents = 'auto';
}

async function updateEmployee(event) {
    event.preventDefault();
    const employeeID = document.getElementById('employeeID').value;
    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Position = document.getElementById('position').value;
    const PhoneNumber = document.getElementById('phoneNumber').value;
    const Email = document.getElementById('email').value;
    const DateOfBirth = document.getElementById('dateOfBirth').value;
    const Address = document.getElementById('address').value;
    const Gender = document.getElementById('gender').value;
    const Nationality = document.getElementById('nationality').value;
    const ZoneID = document.getElementById('zoneID').dataset.zoneId;

    const today = new Date();
    const birthDate = new Date(DateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    if(age < 20 ){
        alert('Your age must be at least 20 years old!!');
        return;
    }

    try {
        const response = await axios.patch(`http://localhost:3000/employee/updateEmployee/${employeeID}`, {
            FirstName,
            LastName,
            Position,
            PhoneNumber,
            Email,
            DateOfBirth,
            Address,
            Gender,
            Nationality,
            ZoneID
        });

        alert("Employee details updated successfully.");
        window.location.href = 'EmployeeDetail.html';  
    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error("Error updating employee:", error);
        alert("Failed to update employee details.");
        }
    }
}



function deleteData(name) {
    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; // รีเซ็ต onclick ก่อนตั้งค่าใหม่
    confirmButton.onclick = confirmDelete; // ตั้งค่าใหม่

    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Delete";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to delete "${name}" ?`;
    document.getElementById('secP').textContent = "The data will not be recoverable.";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#b64747";
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#b64747";
    // แสดง Overlay และ Confirm Box
    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    // ปิดการคลิกบน Overlay เท่านั้น
    document.getElementById('overlay').style.pointerEvents = 'auto';
}

async function confirmDelete() {
    const employeeID = document.getElementById('employeeID').value;

    try {
        const response = await axios.delete(`http://localhost:3000/employee/deleteEmployee/${employeeID}`);
        console.log(response.data);
        // ซ่อน Overlay และ Confirm Box
        document.getElementById('confirmBox').style.display = 'none';
        document.getElementById('overlay').classList.remove('overlay-visible');
        document.getElementById('overlay').style.pointerEvents = 'none';  
        alert("Employee deleted successfully.");
        window.location.href = 'EmployeeDetail.html';  // เปลี่ยนไปที่หน้ารายละเอียดพนักงาน
    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error("Error deleting the employee:", error);
            alert("Failed to delete the employee.");
        }
        
        // ซ่อน Overlay และ Confirm Box
        document.getElementById('confirmBox').style.display = 'none';
        document.getElementById('overlay').classList.remove('overlay-visible');
        document.getElementById('overlay').style.pointerEvents = 'none';  
    }
}

function cancelDelete() {
    // ซ่อน Overlay และ Confirm Box เมื่อยกเลิก
    document.getElementById('confirmBox').style.display = 'none';
    document.getElementById('overlay').classList.remove('overlay-visible');
    document.getElementById('overlay').style.pointerEvents = 'none'; 

     const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
     confirmButton.onclick = null;
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

document.addEventListener('mouseover', (e) => {
    if (e.target.closest('#delete')) {
        const button = e.target.closest('#delete');
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