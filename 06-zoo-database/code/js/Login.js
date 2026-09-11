
const submitData = async (event) => {
    event.preventDefault(); 
    checkToken();
    let password = document.getElementById('password');
    const dialog = document.querySelector('.dialog');

    let email;
    let username;
    const data = document.getElementById('username').value;
    if (data.includes('@')) {
        email = data;
    } else {
        username = data;
    }
    if(email){
        try {
            let loginData = {
                email: email,
                password: password.value
            };

            const response = await axios.post('http://localhost:3000/User/loginEmail', loginData);
            if (response.data.msg === "Login successful" && response.data.token) {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                // เก็บ token ใน localStorage
                localStorage.setItem('username', response.data.username.toLowerCase());
                localStorage.setItem('token', response.data.token);
                // Decode token เพื่อดึงข้อมูล Role
                const decodedToken = jwt_decode(response.data.token);
                const userRole = decodedToken.Role; // ดึง Role จาก token
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                dialog.innerHTML = "<p></p>";
                setTimeout(() => {
                    alert("Login successful");
                    if (userRole === "Admin") {
                        window.location.href = "admin.html";  // สำหรับ Admin
                    } else if (userRole === "User") {
                        window.location.href = "Home.html";  // สำหรับ User
                    }
                }, 3);
            }
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            dialog.innerHTML = `<p>${error.response ? error.response.data.error : "An error occurred"}</p>`;
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('ch-pass').innerHTML = ' <a href="ForgotPassword.html">ลืมรหัสผ่าน?</a>';
        }

    }else if(username){

        try {
            let loginData = {
                username: username,
                password: password.value
            };
    
            const response = await axios.post('http://localhost:3000/User/loginUser', loginData);
            // console.log(response.data);
            if (response.data.msg === "Login successful" && response.data.token) {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                // เก็บ token ใน localStorage
                localStorage.setItem('username', (username).toLowerCase());
                localStorage.setItem('token', response.data.token);
                // Decode token เพื่อดึงข้อมูล Role
                const decodedToken = jwt_decode(response.data.token);
                const userRole = decodedToken.Role; // ดึง Role จาก token
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                dialog.innerHTML = "<p></p>";
                setTimeout(() => {
                    alert("Login successful");
                    if (userRole === "Admin") {
                        window.location.href = "admin.html";  // สำหรับ Admin
                    } else if (userRole === "User") {
                        window.location.href = "Home.html";  // สำหรับ User
                    }
                }, 3);
            }
            
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            dialog.innerHTML = `<p>${error.response ? error.response.data.error : "An error occurred"}</p>`;
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('ch-pass').innerHTML = ' <a href="ForgotPassword.html">ลืมรหัสผ่าน?</a>';
        }
        
    }

    
};

const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found");
        return;
    }else{
        try {
            const response = await axios.get("http://localhost:3000/User/checkToken", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.href = "Home.html"; 
        } catch (error) {
            console.error("Error checking token:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert("Session expired, please log in again.");
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                window.location.reload();
            }
        }
    }
};

window.onload = function() {
    checkToken();
};


window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // รีโหลดเฉพาะเมื่อหน้านี้ถูกดึงจาก cache
        window.location.reload();
        checkToken();
    }
});

function togglePassword(inputId, iconId) {
    var passwordInput = document.getElementById(inputId);
    var toggleIcon = document.getElementById(iconId);
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}