document.addEventListener('DOMContentLoaded', function () {
    const modal = document.querySelector('.modal-content');
    modal.style.display = 'flex'; 
    document.body.classList.add('modal-open');

    axios.get('http://localhost:3000/animalCare/zone')
        .then(response => {
            const zones = response.data;
            const zoneList = document.getElementById('zoneList');
            zoneList.innerHTML = ''; 

            zones.forEach(zone => {
                const zoneDiv = document.createElement('div');
                zoneDiv.className = 'zone-item';
            
                // เพิ่มเนื้อหา   zone id -> <p><strong>Zone ID:</strong> ${zone.ZoneID}</p>
                zoneDiv.innerHTML = `
                    <i class="fa-solid fa-paw"></i>
                    <p id = 'zoneName1'>Zone ${zone.ZoneName}</p>
                    <p>Animal: ${zone.CurrentAnimals}</p>
                    <p>Employee: ${zone.CurrentEmployees}</p>
                `;
            
                zoneDiv.addEventListener('click', () => selectZone(zone.ZoneID)); 
            
        
                zoneList.appendChild(zoneDiv);
            });
        })
        .catch(error => console.error('Error fetching zones:', error));
});

function selectZone(zoneID) {
    console.log('Selected Zone ID:', zoneID);
    window.location.href = `insert2.html?zoneID=${zoneID}`;
}
