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

async function insertAnimal() {
    if (!validateForm()) {
        return;
    }
    try {
        const species = document.getElementById('species').value; 
        const nickname = document.getElementById('nickname').value;
        const subspecies = document.getElementById('subspecies').value;
        const gender = document.getElementById('gender').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const origin = document.getElementById('origin').value;
        const description = document.getElementById('details').value;
        const categoryID = document.getElementById('categoryID').dataset.categoryId;
        const zoneID = document.getElementById('zoneID').dataset.zoneId;

        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        console.log(imageInput);  
        console.log(imageFile);  
        
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (birthDate > today) {
            alert("The date of birth cannot be later than today.");
            return;
        }

        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append('species', species);
        formData.append('nickname', nickname);
        formData.append('subspecies', subspecies);
        formData.append('gender', gender);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('origin', origin);
        formData.append('details', description);
        formData.append('categoryID', categoryID);
        formData.append('zoneID', zoneID);
        

        formData.append('image', imageFile);

    
        const response = await axios.post('http://localhost:3000/animal/insertAnimal', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert('Animal data has been added successfully!');
        window.location.href = "animalsDetails.html";

    } catch (error) {
        if(error.response && error.response.data){
            alert(error.response.data.error);
        }else{
            console.error("Error:", error);
        alert("Failed to add animal. Please try again.");
        }
    }
}


document.getElementById('animalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    insertAnimal();
});

document.getElementById('addImageBtn').addEventListener('click', function() {
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.click();
    if (!imageInput.value) {
        imagePreview.src = "";
    }
});

// ภาพหลังจากเลือกไฟล์
document.getElementById("image").addEventListener("change", function(event) {
    const imagePreview = document.getElementById("imagePreview");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imageUploadContainer = document.querySelector(".image-upload-container");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = "block"; 
            imageUploadContainer.classList.add("uploaded"); 
        };
        reader.readAsDataURL(file);
    }else {
        // กดยกเลิกให้ซ่อน preview และเคลียร์ค่า
        imagePreview.src = "";
        imagePreviewContainer.style.display = "none"; 
        imageUploadContainer.classList.remove("uploaded");
        event.target.value = ""; // รีเซ็ตค่า input
    }
});


//zoneAnimal

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

                categoryDiv.addEventListener('click', () => selectCategory(category.CategoryID ,  category.DietType + '-' + category.HabitatType)); 
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

