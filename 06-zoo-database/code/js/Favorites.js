function gotoProfile(){
    window.location.href = "UserDE/Profile.html";
}


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

function formatDate(dateString) {
    const date = new Date(dateString); // แปลงเป็น Date Object
    return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function loadProfile(userID) {
    axios.get(`http://localhost:3000/User/getProfile/${userID}`)
        .then(response => {
            const profileData = response.data;

            const profileDiv = document.getElementById('profile');

            // <p><strong>UserID:</strong> ${profileData.UserID}</p>
            // <p><strong>Role:</strong> ${profileData.Role}</p>
            // <p><strong>Firstname:</strong> ${profileData.Firstname}</p>
            // <p><strong>Lastname:</strong> ${profileData.Lastname}</p>
            // <p><i class="fas fa-at"></i><strong>Username:&nbsp; </strong> ${profileData.Username}</p>
            const formattedDate = formatDate(profileData.DateOfBirth);
            profileDiv.innerHTML = `
                        <h2>Information</h2>
                        <div class="profile-info">
                        <p><i class="fas fa-user"></i><strong>Name:&nbsp; </strong> ${profileData.Firstname} ${profileData.Lastname}</p>
                        <p><i class="fas fa-envelope"></i><strong>Email:&nbsp; </strong> ${profileData.Email}</p>
                        <p><i class="fas fa-birthday-cake"></i><strong>Date of Birth:&nbsp; </strong> ${formattedDate}</p>
                        <p><i class="fas fa-venus-mars"></i><strong>Gender:&nbsp; </strong> ${profileData.Gender}</p>
                        <p style = "font-size : 12px; color:red; margin-left: auto; margin-right: auto;"  >Click เพื่อแก้ไขข้อมูล หรือ เปลี่ยนรหัสผ่าน</p>
                        </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching profile:', error);

            const profileDiv = document.getElementById('profile');
            profileDiv.innerHTML = `<p style="color: red;">Error fetching profile data.</p>`;
        });
}



document.addEventListener("DOMContentLoaded", () => {
    if (userId) {
        loadProfile(userId);
        // ดึงข้อมูลรายการสัตว์โปรดของผู้ใช้
        axios.get(`http://localhost:3000/Favorite/getAll/${userId}`)
            .then(response => {
                const animalList = response.data;
                console.log(animalList);

                animalList.forEach(animal => {
                    const animalId = animal.AnimalID; 
                    axios.get(`http://localhost:3000/Favorite/animalFavorites/${animalId}`)
                        .then(animalResponse => {
                            console.log(animalResponse.data);

                            if (typeof animalResponse.data === 'object') {
                                const animalDetail = animalResponse.data;

                                const card = document.createElement("div");
                                card.className = "card";
                                card.onclick = () => {
                                    window.location.href = `UserDE/AnimalDetail.html`;
                                    localStorage.setItem("AnimalID", animalDetail.AnimalID);
                                };

                                card.innerHTML = `
                                    <img src="${animalDetail.Image || 'default-image.jpg'}" alt="${animalDetail.Nickname}">
                                    <div class="info">
                                        <h3>${animalDetail.Nickname}</h3>
                                        <p>${animalDetail.Species} (${animalDetail.Gender})</p>
                                        <p>Zone: ${animalDetail.ZoneName}</p>
                                    </div>
                                `;

                                animalCardsContainer.appendChild(card);
                            } else {
                                console.error("The data for animal ID", animalId, "is not an object:", animalResponse.data);
                            }
                        })
                        .catch(animalError => {
                            console.error(`Error fetching animal with ID ${animalId}:`, animalError.response ? animalError.response.data : animalError.message);
                        });
                });
            })
            .catch(error => {
                console.error("Error fetching:", error.response ? error.response.data : error.message);
            });
    } else {
        console.warn("User ID is not defined.");
    }
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // รีโหลดเฉพาะเมื่อหน้านี้ถูกดึงจาก cache
        window.location.reload();
    }
});

window.onload = function() {
    const logoutLink = document.getElementById("logout-link");
    checkToken();
        if (logoutLink) {
            logoutLink.onclick = function() {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.clear();
                loginLink.href = "Login.html";
            };
        }
}

const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        return;
    }else{
        window.location.href = "Home.html"; 
    }
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
        checkToken();
    }
});

