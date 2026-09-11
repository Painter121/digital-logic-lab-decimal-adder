document.addEventListener("DOMContentLoaded", function () {
    const modal = document.createElement("div");
    modal.classList.add("OTPmes");
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-box">
            <p id="modal-message"></p>
            <button id="modal-ok">ตกลง</button>
        </div>
    `;
    document.body.appendChild(modal);
    function disableScroll() {
        document.body.style.overflow = "hidden";
    }

    function enableScroll() {
        document.body.style.overflow = "";
    }
    window.OTPmes = function (message) {
        document.getElementById("modal-message").textContent = message;
        modal.style.display = "flex";
        disableScroll();
    };
    document.getElementById("modal-ok").addEventListener("click", function () {
        modal.style.display = "none";
        enableScroll();
    });
});
const style = document.createElement("style");
style.textContent = `
    .OTPmes {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
    }
    .modal-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
    }
    .modal-box {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        position: relative;
        min-width: 250px;
    }
    .modal-box button {
        margin-top: 10px;
        padding: 5px 15px;
        border: none;
        background: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }
    .modal-box button:hover {
        background: #0056b3;
    }
`;
document.head.appendChild(style);

// แสดงสถานะการโหลด
function showLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'flex'; // แสดง modal แบบกลางจอ
    }
}

// ซ่อนสถานะการโหลด
function hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'none'; // ซ่อน modal
    }
}


function loadChangePasswordForm() {
    document.body.innerHTML = `
        <div class="ch-pass-box">
            <form id="changePasswordFormUnique" onsubmit="event.preventDefault(); changePassword();">
                <h2 class="La1">เปลี่ยนรหัสผ่าน</h2>

                <label>รหัสผ่านใหม่</label>
                <div class="password-container-unique">
                    <input type="password" id="newPasswordUnique" class="input-field-unique" required>
                    <span class="toggle-password-unique" onclick="togglePassword('newPasswordUnique', 'togglePasswordIcon1')">
                        <i id="togglePasswordIcon1" class="fas fa-eye"></i>
                    </span>
                </div>

                <label>ยืนยันรหัสผ่าน</label>
                <div class="password-container-unique">
                    <input type="password" id="confirmPasswordUnique" class="input-field-unique" required>
                    <span class="toggle-password-unique" onclick="togglePassword('confirmPasswordUnique', 'togglePasswordIcon2')">
                        <i id="togglePasswordIcon2" class="fas fa-eye"></i>
                    </span>
                </div>

                <button type="submit" class="btn-unique">เปลี่ยนรหัสผ่าน</button>
            </form>
        </div>
    `;

    // กำหนด required ด้วย JavaScript เผื่อกรณี browser ไม่อ่านค่าจาก innerHTML
    document.getElementById("newPasswordUnique").setAttribute("required", "true");
    document.getElementById("confirmPasswordUnique").setAttribute("required", "true");
}

function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

async function changePassword() {
    const newPasswordDOM = document.getElementById('newPasswordUnique');
    const confirmPasswordDOM = document.getElementById('confirmPasswordUnique');

    if (!validatePassword(newPasswordDOM)) return;

    if (newPasswordDOM.value !== confirmPasswordDOM.value) {
        alert("รหัสผ่านยืนยันไม่ตรงกัน");
        confirmPasswordDOM.focus();
        return;
    }

    try {
        const response = await axios.put(`http://localhost:3000/User/changePassword/${window.userId}`, {
            newPassword: newPasswordDOM.value
        });

        if (response.data.success) {
            alert('เปลี่ยนรหัสผ่านสำเร็จ!');
            window.location.href = "Login.html";
        } else {
            alert('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        }
    } catch (error) {
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
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






document.getElementById('otpForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    let email;
    let username;
    const data = document.getElementById('email-username').value;
    if (data.includes('@')) {
        email = data;
    } else {
        username = data;
    }
    if (email) {
        try {
            const response = await axios.get(`http://localhost:3000/User/getEmail/${email}`)
            if (response.data.success) {
                window.userId = response.data.userId;
                sendOTP(email);
            } else {
                // alert("ไม่พบ Email ในระบบโปรดกรอก Email ใหม่!!");
                OTPmes("ไม่พบ Email ในระบบ โปรดลองอีกครั้ง");
                return;
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง");
        }

    } else if (username) {

        try {
            const response = await axios.get(`http://localhost:3000/User/getUsername/${username}`)
            if (response.data.success) {
                document.getElementById('email-username').value = response.data.email;
                window.userId = response.data.userId;
                sendOTP(response.data.email);
            } else {
                // alert("ไม่พบ Username ในระบบโปรดกรอก Username ใหม่!!");
                OTPmes("ไม่พบ Username ในระบบ โปรดลองอีกครั้ง");
                return;
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง");
        }
    }


});


function sendOTP(email) {
    // ส่งข้อมูลไปยัง backend เพื่อให้ส่ง OTP
    showLoadingModal(); 
    axios.post('http://localhost:3000/User/send-otp', { email: email })
        .then(response => {
            // alert('OTP ถูกส่งไปที่อีเมลของคุณ');
            document.getElementById('email-username').disabled = true;
            document.getElementById('bt-OTP').disabled = true;
            document.getElementById('bt-OTP').style.cursor = 'not-allowed';
            startCountdown(); // เริ่มจับเวลาหลังส่ง OTP
            document.getElementById('otp-box-container').style.display = 'block'; // แสดง OTP container
            document.getElementById('otp-input-container').style.display = 'block'; // แสดงฟอร์มกรอก OTP
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
        })
        .finally(() => {
            hideLoadingModal(); // ซ่อน modal เมื่อคำขอเสร็จสิ้น
        });
}


// ฟังก์ชันเริ่มจับเวลา
function startCountdown() {
    let time = 180; // 3 นาที (180 วินาที)
    const timerDisplay = document.getElementById('timer');

    const countdown = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        // แสดงเวลาที่เหลือ
        timerDisplay.textContent = `OTP หมดอายุใน: ${formatTime(minutes)}:${formatTime(seconds)}`;
        time--;

        if (time < 0) {
            clearInterval(countdown); // หยุดจับเวลาเมื่อหมดเวลา
            alert('OTP หมดอายุแล้ว');
            window.location.reload();
            document.getElementById('otp-display').textContent = 'OTP หมดอายุ';
        }
    }, 1000);
}

// ฟังก์ชันสำหรับ format เวลา (เติม 0 หน้าเลขถ้าจำนวนน้อยกว่า 10)
function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

document.getElementById('verify-otp').addEventListener('click', function () {
    const otpEntered = window.otp
    const email = document.getElementById('email-username').value;
    // ตรวจสอบข้อมูลก่อนส่ง
    console.log("otp:", otpEntered, "email:", email);

    axios.post('http://localhost:3000/User/verify-otp', { otp: otpEntered, email: email })
        .then(response => {
            // alert('OTP ยืนยันตัวตนสำเร็จ');
            OTPmes("OTP ยืนยันตัวตนสำเร็จ");
            loadChangePasswordForm();
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
            // alert('OTP ไม่ถูกต้องหรือหมดอายุ');
            OTPmes("OTP ไม่ถูกต้องหรือหมดอายุ");
        });
});


document.querySelectorAll('.otp-field').forEach((field, index, fields) => {
    field.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < fields.length - 1) {
            fields[index + 1].focus();
        }
    });

    field.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" && !field.value && index > 0) {
            fields[index - 1].focus();
        }
    });
});

function GroupOTP() {
    const otp1 = document.getElementById('OTP-Digit-1').value;
    const otp2 = document.getElementById('OTP-Digit-2').value;
    const otp3 = document.getElementById('OTP-Digit-3').value;
    const otp4 = document.getElementById('OTP-Digit-4').value;
    const otp5 = document.getElementById('OTP-Digit-5').value;
    const otp6 = document.getElementById('OTP-Digit-6').value;

    window.otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    document.getElementById('OTP-Digit-1').value = '';
    document.getElementById('OTP-Digit-2').value = '';
    document.getElementById('OTP-Digit-3').value = '';
    document.getElementById('OTP-Digit-4').value = '';
    document.getElementById('OTP-Digit-5').value = '';
    document.getElementById('OTP-Digit-6').value = '';

    console.log(window.otp);
}