document.addEventListener('DOMContentLoaded', getData);

async function getData() {
    const params = new URLSearchParams(window.location.search);
    const zoneID = params.get('zoneID');

    try {
        const responseAnimal = await axios.get(`http://localhost:3000/animalCare/getAnimalInZone/${zoneID}`);
        const animals = responseAnimal.data;

        const responseEmployee = await axios.get(`http://localhost:3000/animalCare/getEmployeeInZone/${zoneID}`);
        const employees = responseEmployee.data;


        const zoneName = employees[0].ZoneName;
        document.getElementById('title').innerHTML = `<h1 style="color:rgb(255, 255, 255);">Zone ${zoneName}</h1>`;
        const animalList = document.getElementById('animal-list');
        const employeeList = document.getElementById('employee-list');

        let selectedAnimal = null;
        let selectedEmployee = null;

        animals.forEach(animal => {
            const animalItem = document.createElement('div');
            animalItem.className = 'item';
            animalItem.textContent = animal.Species_Nickname;

            animalItem.addEventListener('click', async () => {

                document.querySelectorAll('#animal-list .item').forEach(item => item.classList.remove('selected'));
                animalItem.classList.add('selected');
                selectedAnimal = animal.AnimalID;
                document.getElementById('selected-animal').textContent = `Selected: ${animal.Species} (${animal.Nickname})`; 
            });

            document.querySelector('#animal-list .box2').appendChild(animalItem);
        });

        employees.forEach(employee => {
            const employeeItem = document.createElement('div');
            employeeItem.className = 'item';
            employeeItem.textContent = employee.EmployeeName;

            employeeItem.addEventListener('click', () => {
                document.querySelectorAll('#employee-list .item').forEach(item => item.classList.remove('selected'));
                employeeItem.classList.add('selected');
                selectedEmployee = employee.EmployeeID;
                document.getElementById('selected-employee').textContent = `Selected: ${employee.EmployeeName}`;
            });

            document.querySelector('#employee-list .box2').appendChild(employeeItem);
        });

        document.querySelector('.selectBT button').addEventListener('click', async() => {
            console.log(`Selected Animal: ${selectedAnimal}`);
            console.log(`Selected Employee: ${selectedEmployee}`);

            const currentDate = new Date().toISOString().split('T')[0]; 

            
            try {
                const responseInsert = await axios.post('http://localhost:3000/animalCare/insertAnimalCare', {
                    AnimalID: selectedAnimal,
                    EmployeeID: selectedEmployee,
                    DateOfCare: currentDate,
                    ZoneID: zoneID
                });
                alert('Data inserted successfully!');
                window.location.href = 'animalCareDetail.html';
            } catch (error) {
                if(error.response && error.response.data.message === 'Duplicate entry for PRIMARY KEY detected.'){
                    showNotification()
                    // alert('This entry already exists in the system.');
                }else{
                    console.error('Error inserting data:', error);
                    alert('Failed to insert data.');
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}


function closeNotification() {
    document.getElementById("notification").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// เปิด notification
function showNotification() {
    document.getElementById("notification").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}
