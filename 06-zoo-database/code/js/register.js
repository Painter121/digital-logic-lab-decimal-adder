
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");

document.querySelector('input[name=email]').value = email;

const validateInput = (input, regex, errorMessage) => {
    if (!regex.test(input.value.trim())) {
        alert(errorMessage);
        input.focus();
        return false;
    }
    return true;
};

async function submitData(){
    event.preventDefault();

    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let userNameDOM = document.querySelector('input[name=username]');
    let passwordDOM = document.querySelector('input[name=password]');
    let CFpasswordDOM = document.querySelector('input[name=CFpassword]');
    let emailDOM = document.querySelector('input[name=email]');
    let DateOfBirthDOM = document.querySelector('input[name=DateOfBirth]');
    let genderDOM = document.querySelector('input[name=gender]:checked');

    if (!firstNameDOM.value || !lastNameDOM.value || !userNameDOM.value || 
        !passwordDOM.value || !CFpasswordDOM.value || !emailDOM.value || 
        !DateOfBirthDOM.value || !genderDOM) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }

    let nameRegex = /^[A-Za-zก-ฮะ-์\s]+$/;
    if (!validateInput(firstNameDOM, nameRegex, "ชื่อไม่ควรมีตัวเลขหรืออักขระพิเศษ")) return;
    if (!validateInput(lastNameDOM, nameRegex, "นามสกุลไม่ควรมีตัวเลขหรืออักขระพิเศษ")) return;

    let usernameRegex = /^[A-Za-z0-9_]{4,20}$/;
    if (!validateInput(userNameDOM, usernameRegex, "Username ต้องมีความยาว 4-20 ตัว และไม่มีอักขระพิเศษ")) return;

    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!validateInput(passwordDOM, passwordRegex, "รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวอักษรและตัวเลข")) return;

    if (passwordDOM.value !== CFpasswordDOM.value) {
        alert("การยืนยันรหัสผ่านไม่ตรงกัน");
        CFpasswordDOM.focus();
        return;
    }

    let birthDate = new Date(DateOfBirthDOM.value);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 13) {
        alert("คุณต้องมีอายุอย่างน้อย 13 ปี");
        DateOfBirthDOM.focus();
        return;
    }else if(age >110){
        alert("โปรดกรอกอายุที่ถูกต้อง");
        DateOfBirthDOM.focus();
        return;
    }

    let userdata = {
        Firstname: firstNameDOM.value.trim().replace(/\s+/g, ""),
        Lastname: lastNameDOM.value.trim().replace(/\s+/g, ""),
        Username: userNameDOM.value.trim(),
        Password: passwordDOM.value,
        Email: emailDOM.value.trim(),
        DateOfBirth: DateOfBirthDOM.value,
        Gender: genderDOM.value
    };

    console.log(userdata); 

    try {
        const response = await axios.post('http://localhost:3000/User/registerUser', userdata);
        // console.log('response =', response.data);
        alert("ลงทะเบียนสำเร็จ!");
        window.location.href = "Login.html";
    } catch (error) {
        if(error.response.data.error === "Duplicate email detected. Please use a different email."){
            alert("ตรวจพบ Email นี้อยู่ในระบบ!!!");
            window.location.href ="UserRegister.html";
            return;
        }else if(error.response.data.error === "Duplicate Name detected. Please use a different Name."){
            alert("ชื่อนามสกุลนี้อยู่ในระบบแล้ว โปรดลองอีกครั้ง");
            document.querySelector('input[name=firstname]').value = "";
            document.querySelector('input[name=lastname]').value = "";
            return;
        }else if(error.response.data.error === "Duplicate Username detected. Please use a different Username."){
            alert("Username นี้มีอยู่ในระบบแล้ว โปรดลองอีกครั้ง");
            document.querySelector('input[name=username]').value ="";
            return;
        }
        console.error("เกิดข้อผิดพลาดในการลงทะเบียน", error);
    }
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

