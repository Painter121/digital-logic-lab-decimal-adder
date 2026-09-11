
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


document.getElementById('insertEmployeeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const firstName = document.getElementById('firstName').value.trim().replace(/\s+/g, "");
    const lastName = document.getElementById('lastName').value.trim().replace(/\s+/g, "");
    const position = document.getElementById('position').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value.trim();
    const address = document.getElementById('address').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const nationality = document.getElementById('nationality').value.trim();
    const zoneID = document.getElementById('zoneID').dataset.zoneId.trim();

    // ตรวจสอบค่าที่กรอก
    if (!firstName || !lastName || !position || !phoneNumber || !email || !dateOfBirth || !address || !gender || !nationality || !zoneID) {
        alert('Please fill in all the fields!');
        return;
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

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
        // ส่งข้อมูลไปยัง API
        const response = await axios.post('http://localhost:3000/employee/insertEmployee', {
            FirstName: firstName,
            LastName: lastName,
            Position: position,
            PhoneNumber: phoneNumber,
            Email: email,
            DateOfBirth: dateOfBirth,
            Address: address,
            Gender: gender,
            Nationality: nationality,
            ZoneID: parseInt(zoneID)
        });

        // แจ้งเตือนผลลัพธ์
        alert(response.data.message || 'Employee added successfully!');
        
        // รีเซ็ตฟอร์มหลังการส่งข้อมูล
        document.getElementById('insertEmployeeForm').reset();
        window.location.href = "employeeDetail.html";

    } catch (error) {
        if (error.response && error.response.data) {
            
            alert(error.response.data.error); 
        }else{
            alert('Failed to add employee. Please try again.');
        }
    }
});


//zone
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

