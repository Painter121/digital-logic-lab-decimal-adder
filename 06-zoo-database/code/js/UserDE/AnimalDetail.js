
// const urlParams = new URLSearchParams(window.location.search);
// const animalID = urlParams.get("AnimalID");

const animalID = localStorage.getItem("AnimalID");
const token = localStorage.getItem("token")
let userId, role;
if(token){
    const decodedToken = jwt_decode(token);
    userId = decodedToken.userId;
    role = decodedToken.Role;
}else{
    userId = false;
    role = "User";
}
if (role === "Admin") {
    document.getElementById('Admin-menu').style.display = "block";
} else if (role === "User") {
    document.getElementById('Admin-menu').style.display = "none";
}

if (animalID) {
    axios.get(`http://localhost:3000/WildLife/getAnimalDetails/${animalID}`)
        .then(response => {
            const animal = response.data;
            // console.log(animal);
            displayAnimalDetails(animal);
        })
        .catch(error => {
            console.error("Error fetching animal details:", error);
            document.getElementById("animalCards").innerHTML = `
                <p>Failed to load animal details. Please try again later.</p>`;
        });
    if(userId){
        axios.get(`http://localhost:3000/Favorite/checkFavorite/${userId}/${animalID}`)
        .then(response => {
            setTimeout(() => {
                const likeToggle = document.getElementById("like-toggle");
                window.likeStatus = response.data.exists;
                if (window.likeStatus === true) {
                    likeToggle.checked = true;
                } else if (window.likeStatus === false) {
                    likeToggle.checked = false;
                }
            }, 500);

        })
        .catch(error => {
            console.error(error.response ? error.response.data : error.message);
        });
    }
} else {
    document.getElementById("animalCards").innerHTML = `
        <p>Animal ID not found. Please provide a valid ID.</p>`;
}


function fetchWildlifeTypes(habitatType, animalID) {
    const listElement = document.getElementById("animal-list");
    axios.get(`http://localhost:3000/WildLife/getType/${habitatType}`)
        .then(response => {
            listElement.innerHTML = "";

            if (response.data.length === 0) {
                listElement.innerHTML = "<li>No data found.</li>";
                return;
            }

            response.data.forEach(animal => {
                if (animal.AnimalID === animalID) return;

                const card = document.createElement("div");
                card.className = "card";
                card.onclick = () => {
                    localStorage.setItem("AnimalID", animal.AnimalID);
                    window.location.href = `AnimalDetail.html`;
                };

                card.innerHTML = `
                    <img src="${animal.Image || 'default-image.jpg'}" alt="${animal.Nickname}" class="animal-img">
                    <div class="info">
                        <h3>${animal.Nickname || "Unknown"}</h3>
                        <p>${animal.Species || "Unknown Species"} (${animal.Gender || "Unknown"})</p>
                        <p>Zone: ${animal.ZoneName || "N/A"}</p>
                    </div>
                `;

                const listItem = document.createElement("li");
                listItem.appendChild(card);
                listElement.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("API Error:", error);
            listElement.innerHTML = `<li>Error: ${error.message}</li>`;
        });
}

function scrollToLeft() {
    const list = document.getElementById("animal-list");
    list.scrollBy({ left: -320, behavior: 'smooth' });
}

function scrollToRight() {
    const list = document.getElementById("animal-list");
    list.scrollBy({ left: 320, behavior: 'smooth' });
}



function displayAnimalDetails(animal) {
    const container = document.getElementById("animalCards");
    // console.log(document.getElementById("animal-list"));
    const formattedDate = formatDate(animal.DateOfBirth);
    fetchWildlifeTypes(animal.HabitatType , animal.AnimalID);
    container.innerHTML = `
        <div class="animal-container">
                <div class="animal-card">
                    <div class="pic">
                        <img src="${animal.Image}" class="animal-image" alt="${animal.Nickname}">
                    </div>
                    <div class="name-section">
                        <h2>${animal.Nickname} (${animal.Species})</h2>
                    </div>
                    <div class="info-section">
                        <p><strong>Subspecies: </strong> ${animal.Subspecies || "N/A"}</p>
                        <p><strong>Gender: </strong> ${animal.Gender}</p>
                        <p><strong>Date of Birth: </strong> ${formattedDate}</p>
                        <p><strong>Origin: </strong> ${animal.Origin}</p>
                    </div>
                    <div class="diet-section">
                        <p><strong>Diet Type: </strong> ${animal.DietType}</p>
                    </div>
                    <div class="habitat-section">
                        <p><strong>Habitat Type: </strong>${animal.HabitatType}</p>
                    </div>
                    <div class="zone-section">
                        <p><strong>Zone: </strong> ${animal.ZoneName}</p>
                    </div>

        <div class="like-wrapper">
            <input class="check" type="checkbox" id="like-toggle" />
            <label class="container" for="like-toggle">
                <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                class="icon inactive">
                <path
                    d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 
                    198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 
                    47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 
                    7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 
                    145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 
                    189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 
                    268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 
                    0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                ></path>
                </svg>
                <svg
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon active">
                <path
                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 
                    47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 
                    84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                ></path>
                </svg>
                <div class="checkmark"></div>
                <span class="like-text">Like</span>
            </label>
        </div>
                </div>
                <div class="animal-history">
                    <div class = "TitleDetail"><h3>About ${animal.Species}</h3></div>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${animal.Details || "No additional details available."}</p>
                </div>
            </div>
            `;
    
    document.getElementById('like-toggle').addEventListener('change', handleLikeToggle);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


//ฟังก์ชันคลิกที่หัวใจ
function handleLikeToggle() {
    if (!userId) {
        alert('Login to add to favorites');
        window.location.href = "../login.html";
        return;
    }

    if (window.likeStatus === true) {
        axios.delete(`http://localhost:3000/Favorite/removeFavorite/${userId}/${animalID}`)
            .then(response => {
                window.likeStatus = false; // อัปเดตสถานะ
            })
            .catch(error => {
                console.error("Error removing favorite:", error.response ? error.response.data : error.message);
            });

    } else {
        axios.post(`http://localhost:3000/Favorite/addFavorite`, {
            UserID: userId,
            AnimalID: animalID
        })
            .then(response => {
                // console.log("Added to favorites:", response.data);
                window.likeStatus = true; // อัปเดตสถานะ
            })
            .catch(error => {
                console.error("Error adding favorite:", error.response ? error.response.data : error.message);
            });
    }
}







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
        // console.log("No token found");
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
        window.location.reload();
    }
});
