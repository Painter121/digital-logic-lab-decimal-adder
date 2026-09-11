
const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("barBt");

function toggleSidebar() {
    sidebar.classList.toggle("closeSidebar");
    sidebar.getElementsByClassName("show");

}

function changeIframeSrc(url) {
    console.log(url);
    document.getElementById('iframe').src = url;
}


const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "Home.html";
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



document.getElementById("logout-link").addEventListener("click", function (event) {
    event.preventDefault();
    logout();
});



window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
function changeIframeSrc(page) {
    document.getElementById("iframe").src = page;
}

window.onload = function () {
    const token = localStorage.getItem("token");
    let userId, role;
    if (token) {
        const decodedToken = jwt_decode(token);
        userId = decodedToken.userId;
        role = decodedToken.Role;
    } else {
        userId = false;
        role = "User";
    }
    if (role === "User") {
        window.location.href = "Home.html";
    }
    checkToken();

    const page = getQueryParam("page");
    if (page === "category") {
        changeIframeSrc("adminDE/category/categoryDetail.html");
    } else if (page === "animalCare") {
        changeIframeSrc("adminDE/animalCare/animalCareDetail.html");
    } else if (page === "animals") {
        changeIframeSrc("adminDE/animal/animalsDetails.html");
    } else if (page === "employee") {
        changeIframeSrc("adminDE/employee/employeeDetail.html");
    } else if (page === "zone") {
        changeIframeSrc("adminDE/zone/zoneDetail.html");
    } else if (page === "Dashboard") {
        changeIframeSrc("Dashboard.html");
    }
};


function logout(){
    document.getElementById('myModal').style.display = "block";
}
function closeModal(){
    document.getElementById('myModal').style.display = "none";
}
function confirmLogout(){
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "Home.html";
}