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


document.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const scrollSpeed = 0.5;
    const buffer = 50;
    const backgroundPositionY = scrollTop * scrollSpeed - buffer;

    document.querySelector(".PIC").style.setProperty(
        '--background-position-y',
        `${backgroundPositionY}px`
    );
});
let lastScrollY = 0;
let currentScrollY = 0;

function smoothParallax() {
    currentScrollY += (lastScrollY - currentScrollY) * 0.1;
    const scrollSpeed = 0.5;
    const backgroundPositionY = currentScrollY * scrollSpeed;

    document.querySelector(".PIC").style.setProperty(
        '--background-position-y',
        `${backgroundPositionY}px`
    );
    requestAnimationFrame(smoothParallax);
}
document.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
});
smoothParallax();

document.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const menu = document.querySelector(".menu");

    if (scrollTop > 200) {
        menu.classList.add("sticky");
    } else {
        menu.classList.remove("sticky");
    }

    const scrollSpeed = 0.5;
    const buffer = 50;
    const backgroundPositionY = scrollTop * scrollSpeed - buffer;

    document.querySelector(".PIC").style.setProperty(
        '--background-position-y',
        `${backgroundPositionY}px`
    );
});



function WildLife() {
    window.location.href = './UserDE/WildLife.html';
}
function WaterZone() {
    window.location.href = './UserDE/WaterZone.html';
}
function BirdsZone() {
    window.location.href = './UserDE/BirdsZone.html';
}
function AmphibianZone() {
    window.location.href = './UserDE/Amphibious.html';
}
function animalList() {
    window.location.href = './UserDE/animallist.html';
}



window.onload = function () {

    const loginLink = document.getElementById("login-link");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutLink = document.getElementById("logout-link");

    const username = localStorage.getItem("username");

    if (username) {
        loginLink.textContent = username;
        loginLink.href = "javascript:void(0)";
        loginLink.onclick = function () {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        };

        if (logoutLink) {
            logoutLink.onclick = function () {
                localStorage.removeItem("username");
                localStorage.removeItem("token");

                loginLink.textContent = "Login";
                loginLink.href = "Login.html";

                dropdownMenu.style.display = "none";
                window.location.href = "Home.html";
            };
        }
    } else {
        loginLink.textContent = "Login";
        loginLink.href = "Login.html";
    }

    document.addEventListener("click", function (event) {
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
            localStorage.clear();
            window.location.href = "Login.html"; // ส่งผู้ใช้กลับไปที่หน้า Login
        }
    }
};
// **เรียกเช็ค Token ทุก 5 นาที**
setInterval(checkToken, 300000); // 300000 ms = 5 นาที
// **เช็ค Token ทันทีเมื่อโหลดหน้าเว็บ**
checkToken();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // รีโหลดเฉพาะเมื่อหน้านี้ถูกดึงจาก cache
        window.location.reload();
    }
});



let swiperInstance = null;
let animalData = [];

async function fetchAnimalData() {
    try {
        const response = await fetch("http://localhost:3000/WildLife/RandomAnimals");
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            console.error("No animal data received!");
            return;
        }
        animalData = data.slice(0, 5);
        const swiperWrapper = document.getElementById("swiperWrapper");
        swiperWrapper.innerHTML = "";
        // เพิ่ม slide เข้า Swiper
        animalData.forEach((animal) => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            slide.innerHTML = `
                <div class="slide-content">
                    <img src="data:image/jpeg;base64,${arrayBufferToBase64(animal.Image.data)}" alt="${animal.Species}">
                    <div class="textSlide">
                        <h3  style="color: green; font-size: 40px;">${animal.Nickname} </h3>
                        <h3>(${animal.Species})</h3>
                    </div>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
        if (swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }
        swiperInstance = new Swiper(".swiper", {
            loop: animalData.length >= 3,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            slidesPerView: 1,
            slidesPerGroup: 1,
            on: {
                slideChange: function () {
                    if (swiperInstance) {
                        updateViewButton(swiperInstance.realIndex);
                    }
                },
                reachEnd: function () {
                    swiperInstance.autoplay.stop();
                    setTimeout(() => {
                        fetchAnimalData();
                    }, 3000);
                }
            }
        });
        updateViewButton(0);
        swiperInstance.autoplay.start();
    } catch (error) {
        console.error("Error fetching animal data:", error);
    }
}
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
// ฟังก์ชันอัปเดตปุ่ม View
function updateViewButton(index) {
    if (animalData.length > 0) {
        const selectedAnimal = animalData[index];
        const viewButton = document.getElementById("viewButton");
        viewButton.onclick = () => saveAnimalID(selectedAnimal.AnimalID);
    }
}
// ฟังก์ชันบันทึก AnimalID ลง localStorage
function saveAnimalID(animalID) {
    localStorage.setItem("AnimalID",animalID);
    window.location.href = './UserDE/AnimalDetail.html';
}
fetchAnimalData();

