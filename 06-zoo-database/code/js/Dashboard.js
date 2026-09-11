

document.addEventListener("DOMContentLoaded", function () {
    axios.get("http://localhost:3000/dashboard/getCountData")
        .then(response => {
            const data = response.data;

            document.getElementById("zoneCount").textContent = data.All_Zone;
            document.getElementById("animalCount").textContent = data.All_Animal;
            document.getElementById("employeeCount").textContent = data.All_Employee;
            document.getElementById("userCount").textContent = data.All_User;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});


// ปฎิทิน
document.addEventListener("DOMContentLoaded", async function () {
    var calendarEl = document.getElementById("calendar");

    try {
        const response = await axios.get("http://localhost:3000/dashboard/getAnimalBirthdays");
        const animalData = response.data;

        function generateRecurringEvents(animal) {
            let events = [];
            let birthYear = new Date(animal.DateOfBirth).getFullYear();
            let currentYear = new Date().getFullYear();

            for (let year = birthYear; year <= currentYear + 10; year++) {
                let birthDate = new Date(animal.DateOfBirth);
                birthDate.setUTCFullYear(year);

                events.push({
                    title: `${animal.Nickname} (${animal.Species})`,
                    start: birthDate.toLocaleDateString("en-CA"),
                    allDay: true
                });
            }
            return events;
        }

        let events = [];
        animalData.forEach(animal => {
            events.push(...generateRecurringEvents(animal));
        });

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            editable: false,
            selectable: false,
            events: events,
            dayMaxEventRows: 3,
            moreLinkText: "เพิ่มเติม",

            eventDidMount: function (info) {
                info.el.setAttribute("title", info.event.title);
            }
        });

        calendar.render();
    } catch (error) {
        console.error("Error fetching animal birthdays:", error);
    }
});



// สร้างกราฟ top-animal 
document.addEventListener('DOMContentLoaded', function () {
    function fetchAndRenderTopAnimals() {
        axios.get('http://localhost:3000/dashboard/top-animals')
            .then(response => {
                let data = response.data;
                let groupedData = {};
                data.forEach(item => {
                    let key = item.FavoriteCount;
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(`${item.Species} (${item.Nickname})`);
                });
                let sortedKeys = Object.keys(groupedData)
                    .map(Number)
                    .sort((a, b) => b - a);

                let labels = [];
                let favoriteCounts = [];
                let fullLabels = [];
                let backgroundColors = [];
                let borderColors = [];
                let count = 0;

                // สีที่ใช้สำหรับการแบ่งกลุ่ม
                const colorPalette = [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ];

                const borderPalette = [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ];

                for (let key of sortedKeys) {
                    if (count >= 6) break;
                    let fullLabel = groupedData[key].join(", ");
                    fullLabels.push(fullLabel);
                    labels.push(fullLabel.length > 20 ? fullLabel.substring(0, 20) + "..." : fullLabel);

                    favoriteCounts.push(parseInt(key));
                    backgroundColors.push(colorPalette[count % colorPalette.length]);
                    borderColors.push(borderPalette[count % borderPalette.length]);

                    count++;
                }
                const existingChart = Chart.getChart('topAnimalsChart');
                if (existingChart) {
                    existingChart.destroy();
                }

                const ctx = document.getElementById('topAnimalsChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'จำนวน Favorites',
                            data: favoriteCounts,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${fullLabels[context.dataIndex]}: ${context.raw} Favorites`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0
                                }
                            },
                            x: {
                                ticks: {
                                    autoSkip: false,
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            });
    }
    fetchAndRenderTopAnimals();
});







//กราฟวงกลม DietType
document.addEventListener('DOMContentLoaded', function () {
    axios.get('http://localhost:3000/dashboard/diet-animal-count')
        .then(function (response) {
            const data = response.data;
            const dietTypes = data.map(item => item.DietType);
            const animalCounts = data.map(item => item.AnimalCount);
            const chartContainer = document.querySelector('.DietType');
            const canvas = document.createElement('canvas');
            chartContainer.appendChild(canvas);
            // Pie Chart
            new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: dietTypes,
                    datasets: [{
                        data: animalCounts,
                        backgroundColor: [
                            '#FFC107', // สีสำหรับ สัตว์กินทั้งพืชและสัตว์
                            '#4CAF50', // สีสำหรับ สัตว์กินพืช
                            '#FF5733'  // สีสำหรับ สัตว์กินเนื้อ
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        })
        .catch(function (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        });
});


//กราฟวงกลม HabitatType
document.addEventListener('DOMContentLoaded', function () {
    axios.get('http://localhost:3000/dashboard/habitat-animal-count')
        .then(function (response) {
            const data = response.data;
            const labels = data.map(item => item.HabitatType);
            const animalCounts = data.map(item => item.AnimalCount);
            const ctx = document.getElementById('habitatPieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: animalCounts,
                        backgroundColor: [
                            '#1E88E5', // สีสำหรับ สัตว์น้ำ
                            '#388E3C', // สีสำหรับ สัตว์บก
                            '#FFEB3B', // สีสำหรับ สัตว์ปีก
                            '#607D8B'  // สีสำหรับ สัตว์สะเทินน้ำสะเทินบก
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        })
        .catch(function (error) {
            console.error('Error fetching habitat data:', error);
        });
});


document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/dashboard/animal-care';
    const animalCareContainer = document.querySelector('.animal-care');
    let currentPage = 1;
    const itemsPerPage = 5;
    let data = [];
    function fetchData() {
        axios.get(apiUrl)
            .then(response => {
                data = response.data;
                renderTable();
                renderPagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderTable() {
        animalCareContainer.innerHTML = '';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '10px';
        table.innerHTML = `
        <thead style="background-color: #4CAF50; color: white;">
            <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Zones</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Total Animals Cared</th>
            </tr>
        </thead>
        <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #ddd';
            row.style.textAlign = 'center';
            row.innerHTML = `
            <td style="padding: 8px; border: 1px solid #ddd;">${item.Name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.ZonesCared}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.TotalAnimalsCared}</td>
        `;
            tbody.appendChild(row);
        });

        animalCareContainer.appendChild(table);
    }

    // ฟังก์ชันสร้างปุ่มถัดไปและย้อนกลับ
    function renderPagination() {
        const totalPages = Math.ceil(data.length / itemsPerPage);

        if (totalPages <= 1) return;

        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        pagination.style.display = 'flex';
        pagination.style.justifyContent = 'center';
        pagination.style.gap = '10px';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'ย้อนกลับ';
        prevButton.disabled = currentPage === 1;
        styleButton(prevButton);
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                renderPagination();
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'ถัดไป';
        nextButton.disabled = currentPage === totalPages;
        styleButton(nextButton);
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                renderPagination();
            }
        });

        pagination.appendChild(prevButton);
        pagination.appendChild(nextButton);
        animalCareContainer.appendChild(pagination);
    }
    // ฟังก์ชันสำหรับปรับแต่งปุ่ม
    function styleButton(button) {
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', () => button.style.backgroundColor = '#45a049');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#4CAF50');

        if (button.disabled) {
            button.style.backgroundColor = '#ccc';
            button.style.cursor = 'not-allowed';
        }
    }
    fetchData();
});


document.addEventListener('DOMContentLoaded', function () {
    axios.get('http://localhost:3000/dashboard/CountDataInZone')
        .then(response => {
            const zones = response.data;
            const container = document.getElementById('zoneContainer');

            let showAll = false; // ค่าเริ่มต้นให้แสดงแค่ 2 แถว
            const zonesPerRow = 3; // แต่ละแถวมี 3 โซน
            const initialDisplayCount = zonesPerRow * 2; // แสดงแค่ 2 แถวแรก

            function renderZones() {
                container.innerHTML = ''; // ล้างข้อมูลเดิม
                const displayZones = showAll ? zones : zones.slice(0, initialDisplayCount);

                displayZones.forEach(zone => {
                    const zoneDiv = document.createElement('div');
                    zoneDiv.classList.add('zoneBox');

                    const animalPercent = (zone.AnimalCount / zone.AnimalCapacity) * 100;
                    const employeePercent = (zone.EmployeeCount / zone.EmployeeCapacity) * 100;

                    zoneDiv.innerHTML = `
                        <h2>${zone.ZoneName}</h2>
                        <div><strong>Animals:</strong> ${zone.AnimalCount} / ${zone.AnimalCapacity}</div>
                        <div class="progress-bar">
                            <span class="animal" style="width: ${animalPercent}%;"></span>
                        </div>

                        <div><strong>Employees:</strong> ${zone.EmployeeCount} / ${zone.EmployeeCapacity}</div>
                        <div class="progress-bar">
                            <span class="employee" style="width: ${employeePercent}%;"></span>
                        </div>
                    `;

                    zoneDiv.addEventListener('click', function () {
                        window.location.href = `adminDE/zone/viewZone.html?id=${zone.ZoneID}`;
                    });

                    container.appendChild(zoneDiv);
                });

                // สร้างปุ่ม ดูเพิ่มเติม / น้อยลง
                let button = document.getElementById('toggleButton');
                if (!button) {
                    button = document.createElement('button');
                    button.id = 'toggleButton';
                    button.classList.add('toggle-button');
                    button.addEventListener('click', function () {
                        showAll = !showAll;
                        button.textContent = showAll ? 'น้อยลง' : 'ดูเพิ่มเติม';
                        renderZones(); // อัพเดตการแสดงผล
                    });
                    container.appendChild(button);
                }

                // ตั้งค่าข้อความปุ่มให้ตรงกับสถานะ showAll
                button.textContent = showAll ? 'ซ่อน' : 'ดูเพิ่มเติม';
            }

            renderZones();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});



document.addEventListener("DOMContentLoaded", function () {
    const openModal = document.getElementById("openModal");
    const closeModal = document.querySelector(".close");
    const modal = document.getElementById("infoModal");
    const body = document.body;
    openModal.addEventListener("click", function () {
        modal.style.display = "flex";
        body.classList.add("no-scroll"); 
    });
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
        body.classList.remove("no-scroll");
    });
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            body.classList.remove("no-scroll");
        }
    });
});


