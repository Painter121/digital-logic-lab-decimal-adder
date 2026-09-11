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

document.getElementById('zoneForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    const zoneName = document.getElementById('zoneName').value.trim();
    const animalCapacity = document.getElementById('animalCapacity').value.trim();
    const employeeCapacity = document.getElementById('employeeCapacity').value.trim();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!zoneName || !animalCapacity || !employeeCapacity) {
        alert('Please fill in all the fields!');
        return;
    }

    // ตรวจสอบค่า capacity
    if (animalCapacity <= 0 || employeeCapacity <= 0) {
        alert('Capacity cannot be negative or zero. Please enter valid values.');
        return;
    }

    try {
        // ส่งข้อมูลไปยัง API
        const response = await axios.post('http://localhost:3000/zone/insertZone', {
            ZoneName: zoneName,
            AnimalCapacity: parseInt(animalCapacity),
            EmployeeCapacity: parseInt(employeeCapacity)
        });

        // เพิ่มโซนใหม่ในรายการ
        const zoneList = document.getElementById('zoneList');
        if (zoneList.children[0].textContent === 'No zones added yet') {
            zoneList.innerHTML = ''; // ลบข้อความ placeholder
        }
        document.getElementById('buttonZone').innerHTML = '<button id="submitZone" style="margin-top: 50px;" onclick="SelectButton()">Submit</button>';
        const listItem = document.createElement('li');
        listItem.textContent = `Zone: ${zoneName} | Animal Capacity: ${animalCapacity} | Employee Capacity: ${employeeCapacity}`;
        zoneList.appendChild(listItem);

        // Reset form
        document.getElementById('zoneForm').reset();

        alert(response.data.message || 'Zone added successfully!');
    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error('Error adding zone:', error);
        alert('Failed to add zone. Please try again.');
        }
    }
});


function SelectButton(){
    window.location.href = 'zoneDetail.html';
}