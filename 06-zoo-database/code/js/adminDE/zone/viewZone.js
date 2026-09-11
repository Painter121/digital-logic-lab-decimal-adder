function containsSpecialCharacters(input) {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialChars.test(input);
}

function validateForm() {
    const zoneName = document.getElementById('zoneName').value;
    if(containsSpecialCharacters(zoneName)) {
        alert("zoneName contains special characters.");
        return false;
    }
    return true;
}

async function zoneDetails(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าหรือการส่งฟอร์ม
    try {
        // ดึง zoneID จาก URL query string
        const params = new URLSearchParams(window.location.search);
        const zoneID = params.get('id');

        if (!zoneID) {
            throw new Error("zone ID is missing from the URL");
        }

        // เรียกใช้ API เพื่อดึงข้อมูลของโซน
        const response = await axios.get(`http://localhost:3000/zone/getZone/${zoneID}`);
        const zone = response.data;

        window.EmployeeCapacity = zone.EmployeeCapacity;
        window.AnimalCapacity = zone.AnimalCapacity;
        
        // เติมข้อมูลในฟอร์ม
        document.getElementById('zoneID').value = zone.ZoneID;
        document.getElementById('zoneName').value = zone.ZoneName;
        document.getElementById('animalCapacity').value = zone.AnimalCapacity;
        document.getElementById('employeeCapacity').value = zone.EmployeeCapacity;

        document.getElementById('delete').addEventListener('click', function () {
            deleteData(zone.ZoneName);
        });


    } catch (error) {
        console.error("Error fetching zone details:", error);
        alert("Failed to fetch zone details.");
    }
}

// เรียกใช้ฟังก์ชันเมื่อหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', zoneDetails);

function confirmUpdate(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const form = document.querySelector('form');
    if (!form.checkValidity()) {
        form.reportValidity(); // แสดงข้อความ required ที่ฟิลด์ที่ยังไม่ถูกกรอก
        return;
    }
    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; 
    confirmButton.onclick = updateZone;
    const zoneName = document.getElementById('zoneName').value;

    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Update";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#45a049";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to update "${zoneName}" ? `;
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#45a049";
    document.getElementById('overlay').style.pointerEvents = 'auto';
}

async function updateZone(event) {
    event.preventDefault();

    const zoneID = document.getElementById('zoneID').value;
    const zoneName = document.getElementById('zoneName').value;
    const animalCapacity = document.getElementById('animalCapacity').value;
    const employeeCapacity = document.getElementById('employeeCapacity').value;

    if (!zoneID || !zoneName || !animalCapacity || !employeeCapacity) {
        alert("All fields are required!");
        return;
    }

    if (animalCapacity <= 0 || employeeCapacity <= 0) {
        alert("Capacity cannot be negative or zero. Please enter a valid value.");
        return;
    }
    

    try {
        const getZoneResponse = await axios.get(`http://localhost:3000/zone/getCapacityZone/${zoneID}`);
        const zoneData = getZoneResponse.data;
        const RemainingEmployeeCapacity = zoneData[0].RemainingEmployeeCapacity;
        const RemainingAnimalCapacity = zoneData[0].RemainingAnimalCapacity;
        console.log(RemainingEmployeeCapacity);
        console.log(RemainingAnimalCapacity);

        const oldEmployeeCapacity = window.EmployeeCapacity;
        const oldAnimalCapacity = window.AnimalCapacity;

        if (RemainingAnimalCapacity < 0 && oldAnimalCapacity > 0) {
            alert("Please remove Animal from the zone before reducing the Animal capacity.");
            return;
        }

        if (RemainingEmployeeCapacity < 0 && oldEmployeeCapacity > 0) {
            alert("Please remove employees from the zone before reducing the employee capacity.");
            return;
        }

        if (animalCapacity < oldAnimalCapacity) {
            const difference = oldAnimalCapacity - animalCapacity;
            if (difference > RemainingAnimalCapacity) {
                alert("Please remove Animal from the zone before reducing the Animal capacity.");
                return;
            }
        }

        if (employeeCapacity < oldEmployeeCapacity) {
            const difference = oldEmployeeCapacity - employeeCapacity;
            if (difference > RemainingEmployeeCapacity) {
                alert("Please remove employees from the zone before reducing the employee capacity.");
                return;
            }
        }

        const response = await axios.patch(`http://localhost:3000/zone/updateZone/${zoneID}`, {
            ZoneName: zoneName,
            AnimalCapacity: animalCapacity,
            EmployeeCapacity: employeeCapacity
        });

        console.log(response.data);
        alert("Zone updated successfully.");
        window.location.href = 'zoneDetail.html';  // เปลี่ยนไปที่หน้ารายละเอียดโซน
    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error("Error updating the zone:", error);
            alert("Failed to update the zone.");
        } 
    }
}

function deleteData(zone) {
    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; // รีเซ็ต onclick ก่อนตั้งค่าใหม่
    confirmButton.onclick = confirmDelete; // ตั้งค่าใหม่

    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Delete";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to delete "${zone}" ?`;
    document.getElementById('secP').textContent = "The data will not be recoverable.";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#b64747";
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#b64747";
    
    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    document.getElementById('overlay').style.pointerEvents = 'auto';
}

async function confirmDelete() {
    
    const zoneID = document.getElementById('zoneID').value;
    try {
        const response = await axios.delete(`http://localhost:3000/zone/deleteZone/${zoneID}`);
        console.log(response.data);
        // ซ่อน Overlay และ Confirm Box
        document.getElementById('confirmBox').style.display = 'none';
        document.getElementById('overlay').classList.remove('overlay-visible');
        document.getElementById('overlay').style.pointerEvents = 'none';  // คืนค่าการคลิกปกติ
        alert("Zone deleted successfully.");
        window.location.href = 'zoneDetail.html';  // เปลี่ยนไปที่หน้ารายละเอียดโซน
    } catch (error) {
        console.log(error);
        if(error.response && error.response.data){
            alert(error.response.data.message);
        }else{
            console.error("Error deleting the zone:", error);
            alert("Failed to delete the zone.");
        }
        // ซ่อน Overlay และ Confirm Box
        document.getElementById('confirmBox').style.display = 'none';
        document.getElementById('overlay').classList.remove('overlay-visible');
        document.getElementById('overlay').style.pointerEvents = 'none';  // คืนค่าการคลิกปกติ
    }
}

function cancelDelete() {
    // ซ่อน Overlay และ Confirm Box เมื่อยกเลิก
    document.getElementById('confirmBox').style.display = 'none';
    document.getElementById('overlay').classList.remove('overlay-visible');
    document.getElementById('overlay').style.pointerEvents = 'none';

    // รีเซ็ต onclick ของ confirm button
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