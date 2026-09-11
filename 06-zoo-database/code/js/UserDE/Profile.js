

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

if (role === "Admin") {
    document.getElementById('Admin-menu').style.display = "block";
} else if (role === "User") {
    document.getElementById('Admin-menu').style.display = "none";
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        calendar: 'gregory'
    });
}
// Email กรณีเปลี่ยน
{/* <div class="profile-item">
<div class="box1">
    <strong>Email</strong>
</div>
<div class="box2">
<span>${profileData.Email}</span>
</div>
<div class="box3">
    <button onclick="editInfo('Email', '${profileData.Email}')">แก้ไข</button>
</div>
</div> */}

function loadProfileFromToken() {
    if (userId) {
        axios.get(`http://localhost:3000/User/getProfile/${userId}`)
            .then(response => {
                const profileData = response.data;
                const formattedDate = formatDate(profileData.DateOfBirth);

                const profileDiv = document.getElementById('profile');
                profileDiv.innerHTML = `
                <div class="profile-item">
                    <div class = "box1">
                        <strong>Username</strong>
                    </div>
                <div class="box2">
                        <span>${profileData.Username}</span>
                </div>
                <div class="box3">

                </div>
                </div>
                <div class="profile-item">
                    <div class = "box1">
                        <strong>Email</strong>
                    </div>
                <div class="box2">
                        <span>${profileData.Email}</span>
                </div>
                <div class="box3">

                </div>
                </div>
                <div class="profile-item">
                    <div class="box1">
                        <strong>Name</strong>
                    </div>
                <div class="box2">
                    <span>${profileData.Firstname} ${profileData.Lastname}</span>
                </div>
                    <div class="box3">
                        <button onclick="editInfo('Name', '${profileData.Firstname} ${profileData.Lastname}')">แก้ไข</button>
                </div>
                </div>
               
                <div class="profile-item">
                    <div class="box1">
                        <strong>Date of Birth</strong>
                    </div>
                    <div class="box2">
                        <span>${formattedDate}</span>
                    </div>
                    <div class="box3">
                        <button onclick="editInfo('DateOfBirth', '${profileData.DateOfBirth}')">แก้ไข</button>
                    </div>
                    
                </div>
                <div class="profile-item">
                    <div class="box1">
                        <strong>Gender</strong>
                    </div>
                    <div class="box2">
                        <span>${profileData.Gender}</span>
                    </div>
                    <div class="box3">
                        <button onclick="editInfo('Gender', '${profileData.Gender}')">แก้ไข</button>
                    </div>
                </div>
                
`;
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                document.getElementById('profile').innerHTML = `<p style="color: red;">Error fetching profile data.</p>`;
            });
    } else {
        document.getElementById('profile').innerHTML = `<p style="color: red;">No valid user ID found in token.</p>`;
    }
}

let currentField = '';
let currentValue = '';


function editInfo(field, value) {
    currentField = field;
    console.log("field = " + field);
    document.getElementById('modalTitle').innerText = `Edit ${field}`;

    const modalEmail = document.getElementById('modalEmail');
    const modalDate = document.getElementById('modalDate');
    const modalDropdown = document.getElementById('modalDropdown');
    const nameFields = document.getElementById('nameFields');
    const firstnameInput = document.getElementById('firstnameInput');
    const lastnameInput = document.getElementById('lastnameInput');

    nameFields.style.display = 'none';
    modalEmail.style.display = 'none';
    modalDate.style.display = 'none';
    modalDropdown.style.display = 'none';

    if (field === 'Name') {
        const [firstname, lastname] = value.split(' ');

        firstnameInput.value = firstname || '';
        lastnameInput.value = lastname || '';
        nameFields.style.display = 'block';
    } else if (field === 'Email') {
        modalEmail.value = value;
        modalEmail.style.display = 'block';
    } else if (field === 'DateOfBirth') {
        const dateObject = new Date(value);
        console.log(dateObject);
        const formattedDate = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
        console.log(formattedDate);
        modalDate.value = formattedDate;
        modalDate.style.display = 'block';

    } else if (field === 'Gender') {
        modalDropdown.value = value;
        modalDropdown.style.display = 'block';
    }
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }
}





async function saveChanges() {
    const modalEmail = document.getElementById('modalEmail');
    const modalDate = document.getElementById('modalDate');
    const modalDropdown = document.getElementById('modalDropdown');
    const firstnameInput = document.getElementById('firstnameInput');
    const lastnameInput = document.getElementById('lastnameInput');

    let updatedData = {};

    if (currentField === 'Name') {
        const firstname = firstnameInput.value.trim().replace(/\s+/g, "");
        const lastname = lastnameInput.value.trim().replace(/\s+/g, "");
    
        const specialCharPattern = /[^a-zA-Zก-ฮ\s]/;
    
        if (specialCharPattern.test(firstname) || specialCharPattern.test(lastname)) {
            alert('ชื่อหรือนามสกุลไม่ควรมีอักขระพิเศษ');
            return;
        } else {
            updatedData.Firstname = firstname;
            updatedData.Lastname = lastname;
        }
    }
    else if (currentField === 'Email') {
        updatedData.Email = modalEmail.value;
    } else if (currentField === 'DateOfBirth') {
        const birthDate = new Date(modalDate.value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 13) {
            alert("คุณต้องมีอายุอย่างน้อย 13 ปี");
            return;
        }

        updatedData.DateOfBirth = modalDate.value;
    } else if (currentField === 'Gender') {
        updatedData.Gender = modalDropdown.value;
    }

    try {
        const response = await axios.put(`http://localhost:3000/User/updateUser/${userId}`, updatedData);
        console.log("Update successful:", response.data);

        alert("ข้อมูลอัปเดตสำเร็จ!");

        // โหลดข้อมูลโปรไฟล์ใหม่หลังจากอัปเดตเสร็จ
        loadProfileFromToken();

    } catch (error) {
        if(error.response.data.error === "Duplicate name detected. Please use a different name."){
            alert(`อัปเดตไม่สำเร็จ: ชื่อและนามสกุลมีอยู่ในระบบแล้ว`);
        }else if (error.response) {
            console.error("Update failed:", error.response.data.error);
            alert(`อัปเดตไม่สำเร็จ: ${error.response.data.error}`);
        } else {
            console.error("Error:", error.message);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    }

    closeModal();
}


function openCurrentPasswordModal() {
    document.getElementById('currentPasswordModal').style.display = 'flex';
    document.body.classList.add('no-scroll');
}

function closeModal2(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('no-scroll');
}

function closeModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}
document.getElementById('closeButton').addEventListener('click', closeModal);

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// ฟังก์ชันสำหรับล้างค่าใน Textbox
function clearPasswordFields() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// ฟังก์ชันสำหรับเปิด Modal และล้างค่าเก่า
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    clearPasswordFields();
}


function validatePassword(inputElement) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(inputElement.value)) {
        alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวอักษรและตัวเลข");
        inputElement.focus();
        return false;
    }
    return true;
}

async function verifyCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword').value;

    try {
        const response = await axios.post(`http://localhost:3000/User/verifyPassword/${userId}`,
            { currentPassword },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
            closeModal2('currentPasswordModal');
            document.getElementById('newPasswordModal').style.display = 'flex';
            clearPasswordFields();
        } else {
            alert('รหัสผ่านไม่ถูกต้อง');
            clearPasswordFields();
        }
    } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message || 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
            clearPasswordFields();
        } else {
            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
    }
}

// ฟังก์ชันสำหรับบันทึกรหัสผ่านใหม่
async function changePassword() {
    const newPasswordDOM = document.getElementById('newPassword');
    const confirmPasswordDOM = document.getElementById('confirmPassword');

    if (!validatePassword(newPasswordDOM)) return;

    if (newPasswordDOM.value !== confirmPasswordDOM.value) {
        alert("รหัสผ่านยืนยันไม่ตรงกัน");
        confirmPasswordDOM.focus();
        return;
    }

    try {
        const response = await axios.put(`http://localhost:3000/User/changePassword/${userId}`, {
            newPassword: newPasswordDOM.value
        });

        if (response.data.success) {
            alert('เปลี่ยนรหัสผ่านสำเร็จ!');
            closeModal2('newPasswordModal');
        } else {
            alert('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        }
    } catch (error) {
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
}



loadProfileFromToken();

const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        return;
    } else {
        window.location.href = "Home.html";
    }
}

window.onload = function () {
    const logoutLink = document.getElementById("logout-link");
    checkToken();
    if (logoutLink) {
        logoutLink.onclick = function () {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            localStorage.clear();
            loginLink.href = "Login.html";
        };
    }
}
