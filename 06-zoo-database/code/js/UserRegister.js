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

document.getElementById('otpForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    try {
        const response = await axios.get(`http://localhost:3000/User/getEmail/${email}`)
        if (response.data.success) {
            // alert("อีเมลนี้มีอยู่ในระบบ โปรดกรอกอีเมลใหม่");
            OTPmes("อีเมลนี้มีอยู่ในระบบ โปรดกรอกอีเมลใหม่");
            return;
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        alert("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง");
    }

    // ส่ง OTP
    
    showLoadingModal(); // แสดง modal 
    axios.post('http://localhost:3000/User/send-otp', { email: email })
        .then(response => {
            // alert('OTP ถูกส่งไปที่อีเมลของคุณ');
            document.getElementById('email').disabled = true;
            document.getElementById('bt-OTP').disabled = true;
            document.getElementById('bt-OTP').style.cursor = 'not-allowed'; 
            startCountdown(); // เริ่มจับเวลาหลังส่ง OTP
            document.getElementById('otp-box-container').style.display = 'block'; // OTP container
            document.getElementById('otp-input-container').style.display = 'block'; // ฟอร์มกรอก OTP
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
        })
        .finally(() => {
            hideLoadingModal(); // ซ่อน modal เมื่อคำขอเสร็จสิ้น
        });
});


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
    const email = document.getElementById('email').value;
    // ตรวจสอบข้อมูลก่อนส่ง
    console.log("otp:", otpEntered, "email:", email);

    axios.post('http://localhost:3000/User/verify-otp', { otp: otpEntered, email: email })
        .then(response => {
            // alert('OTP ยืนยันตัวตนสำเร็จ');
            OTPmes("OTP ยืนยันตัวตนสำเร็จ");
            window.location.href = `register.html?email=${encodeURIComponent(email)}`;
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