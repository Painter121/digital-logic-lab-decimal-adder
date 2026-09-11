function containsSpecialCharacters(input) {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialChars.test(input);
}
function validateForm() {
    const species = document.getElementById('species').value;
    const nickname = document.getElementById('nickname').value;
    const subspecies = document.getElementById('subspecies').value;
    const origin = document.getElementById('origin').value;

    if (containsSpecialCharacters(species)) {
        alert("species contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(nickname)) {
        alert("nickname contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(subspecies)) {
        alert("subspecies contains special characters.");
        return false;
    }

    if (containsSpecialCharacters(origin)) {
        alert("origin contains special characters.");
        return false;
    }
    return true;
}

async function fetchAnimalDetails() {
    try {
        // ดึง animalID จาก URL query string
        const params = new URLSearchParams(window.location.search);
        const animalID = params.get('id');

        if (!animalID) {
            throw new Error("Animal ID is missing from the URL");
        }

        // เรียกใช้ API เพื่อดึงข้อมูลของสัตว์
        const response = await axios.get(`http://localhost:3000/animal/getAnimalDetails/${animalID}`);
        const animal = response.data;
        if (!animal) {
            throw new Error("Animal not found");
        }
        console.log(animal)

        // เติมข้อมูลในฟอร์ม
        document.getElementById('animalID').value = animal.AnimalID;
        document.getElementById('species').value = animal.Species;
        document.getElementById('nickname').value = animal.Nickname;
        document.getElementById('subspecies').value = animal.Subspecies;
        document.getElementById('gender').value = animal.Gender;
        document.getElementById('zoneID').dataset.zoneId = animal.ZoneID;
        document.getElementById('zoneID').value = animal.ZoneName;
        document.getElementById('categoryID').dataset.categoryId = animal.CategoryID;
        document.getElementById('categoryID').value = animal.DietType + '-' + animal.HabitatType;

        // กำหนดวันที่ให้ถูกต้องในรูปแบบ YYYY-MM-DD
        const formattedDateOfBirth = new Date(animal.DateOfBirth);
        const year = formattedDateOfBirth.getFullYear();
        const month = String(formattedDateOfBirth.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDateOfBirth.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById('dateOfBirth').value = formattedDate;

        document.getElementById('origin').value = animal.Origin;
        document.getElementById('details').value = animal.Details;

        // แสดงภาพของสัตว์
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = animal.Image || ''; // ถ้าไม่มีภาพให้แสดงรูปเปล่า

        // การอัพโหลดรูปภาพใหม่
        document.getElementById('image').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result; // แสดงภาพใหม่ใน imagePreview
                };
                reader.readAsDataURL(file); // อ่านไฟล์เป็น DataURL
            }
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('animalDetails').innerHTML = `<p style="color: red;">Please try again.</p>`;
    }
}
// เรียกใช้ฟังก์ชันเมื่อหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', fetchAnimalDetails);




// Zone Modal functions
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

    axios.get('http://localhost:3000/zone/getZoneList')
        .then(response => {
            const zones = response.data;
            const zoneList = document.getElementById('zoneList');
            zoneList.innerHTML = '';

            const availableZones = zones.filter(zone => zone.RemainingAnimalCapacity > 0 && zone.EmployeeStatus === '1');

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
                    <p>พื้นที่เหลือ ${zone.RemainingAnimalCapacity}</p>
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

// Category Modal functions
function selectCategory(categoryID , categoryName) {
    document.getElementById('categoryID').dataset.categoryId = categoryID;
    document.getElementById('categoryID').value = categoryName;
    document.getElementById('categoryModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

document.getElementById('selectCategoryBtn').addEventListener('click', function () {
    const modal = document.getElementById('categoryModal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    axios.get('http://localhost:3000/category/getAll')
        .then(response => {
            const categories = response.data;
            const categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = '';

            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-item';
                categoryDiv.style.border = '1px solid #ccc';
                categoryDiv.style.margin = '10px';
                categoryDiv.style.padding = '10px';
                categoryDiv.style.cursor = 'pointer';

                // <p><strong>Category ID:</strong> ${category.CategoryID}</p>
                categoryDiv.innerHTML = `
                    <p><strong>DietType</strong></p>
                    <p id = 'textType'> ${category.DietType}</p>
                    <div id = 'Type-Diet'></div>
                    <p><strong>HabitatType</strong></p>
                    <p id = 'textType'>${category.HabitatType}</p>
                `;

                categoryDiv.addEventListener('click', () => selectCategory(category.CategoryID , category.DietType + '-' + category.HabitatType));
                categoryList.appendChild(categoryDiv);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
});

document.querySelector('.category-close').addEventListener('click', function () {
    const modal = document.getElementById('categoryModal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
});


window.onclick = function (event) {
    const zoneModal = document.getElementById('zoneModal');
    const categoryModal = document.getElementById('categoryModal');
    
    if (event.target === zoneModal) {
        zoneModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    if (event.target === categoryModal) {
        categoryModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
};

function confirmUpdate(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }
    
    const animalSpecies = document.getElementById('species').value;
    const animalName = document.getElementById('nickname').value;

    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; 
    confirmButton.onclick = updateAnimalDetails;

    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    // เปลี่ยนข้อความใน Confirm Box
    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Update";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#45a049";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to update "${animalSpecies} (${animalName})" ?`;
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#45a049";
    // ปิดการคลิกบน Overlay เท่านั้น
    document.getElementById('overlay').style.pointerEvents = 'auto';
}



async function updateAnimalDetails(event) {
    
    try {
        event.preventDefault();
        // ดึงข้อมูลจากฟอร์ม
        const animalID = document.getElementById('animalID').value;
        const species = document.getElementById('species').value;
        const nickname = document.getElementById('nickname').value;
        const subspecies = document.getElementById('subspecies').value;
        const gender = document.getElementById('gender').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const origin = document.getElementById('origin').value;
        const details = document.getElementById('details').value;
        const categoryID = document.getElementById('categoryID').dataset.categoryId;
        const zoneID = document.getElementById('zoneID').dataset.zoneId;
        const imageFile = document.getElementById('image').files[0];
        console.log(imageFile);

        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (birthDate > today) {
            alert("The date of birth cannot be later than today.");
            return;
        }

        const responseImg = await axios.get(`http://localhost:3000/animal/getAnimalImage/${animalID}`);
        let oldImg = responseImg.data;
        // console.log(oldImg.Image);
        if (!imageFile && !oldImg.Image) {
            alert("Please upload an image.");
            return;
        }
        // สร้าง FormData เพื่อส่งข้อมูลทั้งหมด (รวมถึงไฟล์)
        const formData = new FormData();
        formData.append('species', species);
        formData.append('nickname', nickname);
        formData.append('subspecies', subspecies);
        formData.append('gender', gender);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('origin', origin);
        formData.append('details', details);
        formData.append('categoryID', categoryID);
        formData.append('zoneID', zoneID);
        if (imageFile) {
            formData.append('image', imageFile); 
        }        
        
        // เรียกใช้ API ด้วย axios
        const response = await axios.patch(
            `http://localhost:3000/animal/updateAnimal/${animalID}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert("Animal details updated successfully.");
        window.location.href = 'animalsDetails.html';

    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error('Error updating animal details:', error);
            alert('There was an error while updating the animal details.');
        }
    }
}
document.getElementById('animalForm').addEventListener('submit', confirmUpdate);








function deleteData() {
    const confirmButton = document.getElementById('confirmBox').querySelector('.confirm');
    confirmButton.onclick = null; // รีเซ็ต onclick ก่อนตั้งค่าใหม่
    confirmButton.onclick = confirmDelete; // ตั้งค่าใหม่

    const animalSpecies = document.getElementById('species').value;
    const animalName = document.getElementById('nickname').value;

    document.getElementById('confirmBox').querySelector('h2').textContent = "Confirm Delete";
    document.getElementById('confirmBox').querySelector('p').textContent = `Are you sure you want to delete "${animalSpecies} (${animalName})" ?`;
    document.getElementById('secP').textContent = "The data will not be recoverable.";
    document.getElementById('confirmBox').querySelector('h2').style.color = "#b64747";
    document.getElementById('confirmBox').querySelector('.confirm').style.backgroundColor = "#b64747";
    
    document.getElementById('overlay').classList.add('overlay-visible');
    document.getElementById('confirmBox').style.display = 'block';
    document.getElementById('overlay').style.pointerEvents = 'auto';
}

async function confirmDelete() {
    const animalIDElement = document.getElementById('animalID');
    const animalID = animalIDElement.value;

    try {
        const response = await axios.delete(`http://localhost:3000/animal/deleteAnimal/${animalID}`);
        console.log(response.data);
        document.getElementById('confirmBox').style.display = 'none';
        alert("Animal deleted successfully.");
        window.location.href = 'animalsDetails.html';
    } catch (error) {
            if(error.response && error.response.data){
                alert(error.response.data.error);
            }else{
                console.error("Error deleting the animal:", error);
                alert("Failed to delete the animal.");
            }
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