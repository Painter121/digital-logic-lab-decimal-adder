const token = localStorage.getItem("token")
let userId, role;
if (token) {
    const decodedToken = jwt_decode(token);
    userId = decodedToken.userId;
    role = decodedToken.Role;
} else {
    userId = false;
    role = "User";
}
if (role === "Admin") {
    document.getElementById('Admin-menu').style.display = "block";
} else if (role === "User") {
    document.getElementById('Admin-menu').style.display = "none";
}

let animals = [];

axios.get('http://localhost:3000/WildLife/getAnimals')
    .then(response => {
        animals = response.data; 
        displayAnimals(animals);
    })
    .catch(error => {
        console.error('Error fetching animals:', error);
    });

function displayAnimals(animals) {
    const columns = document.querySelectorAll('.content .row .column');
    columns.forEach(column => {
        column.innerHTML = '';
    });

    animals.forEach((animal, index) => {
        const columnIndex = index % 4;
        const column = document.querySelectorAll('.content .row .column')[columnIndex];

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        const image = document.createElement('img');
        image.src = animal.Image || '';
        image.alt = animal.Species || '';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const text = document.createElement('div');
        text.className = 'text';
        text.innerText = `${animal.Species || 'Unknown Species'} - ${animal.Nickname || 'No Nickname'}`;

        overlay.appendChild(text);
        imageContainer.appendChild(image);
        imageContainer.appendChild(overlay);

        imageContainer.addEventListener('click', () => {
            // window.location.href = `AnimalDetail.html?AnimalID=${animal.AnimalID}`;
            window.location.href = `AnimalDetail.html`;
            localStorage.setItem("AnimalID" , animal.AnimalID);
        });

        column.appendChild(imageContainer);
    });
}

function searchAnimal() {
    const searchQuery = document.querySelector('.searchBar input').value.toLowerCase();
    const filteredAnimals = animals.filter(animal => {
        const species = animal.Species.toLowerCase();
        const nickname = animal.Nickname.toLowerCase();
        return species.includes(searchQuery) || nickname.includes(searchQuery);
    });

    displayAnimals(filteredAnimals);

    const resultCount = document.querySelector('.resultCount');
    resultCount.textContent = `${filteredAnimals.length} animals found`;
}

document.querySelector('.searchBar input').addEventListener('input', searchAnimal);



window.onload = function() {
    const loginLink = document.getElementById("login-link");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutLink = document.getElementById("logout-link");

    const username = localStorage.getItem("username");

    if (username) {
        loginLink.textContent = username; 
        loginLink.href = "javascript:void(0)"; 
        loginLink.onclick = function() {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        };

        if (logoutLink) {
            logoutLink.onclick = function() {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.clear();
                loginLink.textContent = "Login";
                loginLink.href = "../Login.html";

                dropdownMenu.style.display = "none";
                window.location.href = "../Home.html";
            };
        }
    } else {
        loginLink.textContent = "Login";
        loginLink.href = "../Login.html";
    }

    document.addEventListener("click", function(event) {
        if (!event.target.closest("#user-menu")) {
            dropdownMenu.style.display = "none";
        }
    });
};



const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found");
        return;
    }
    try {
        const response = await axios.get("http://localhost:3000/User/checkToken", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log(response.data); // Token ยังใช้งานได้
    } catch (error) {
        console.error("Error checking token:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            alert("Session expired, please log in again.");
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            window.location.href = "../Login.html"; // ส่งผู้ใช้กลับไปที่หน้า Login
        }
    }
};
// **เรียกเช็ค Token ทุก 5 นาที**
setInterval(checkToken, 300000); // 300000 ms = 5 นาที
// **เช็ค Token ทันทีเมื่อโหลดหน้าเว็บ**
checkToken();