async function getCategory() {
    try {
        const response = await axios.get('http://localhost:3000/category/getCategory');
        const data = response.data;

        const tableBody = document.querySelector('#categoryTable tbody');
        console.log(data);
        

        data.forEach(category => {
            const row = document.createElement('tr');
            row.setAttribute('data-CategoryID', category.CategoryID); 
            row.setAttribute('data-DietType', category.DietType);
            row.setAttribute('data-HabitatType', category.HabitatType);
            row.setAttribute('data-AnimalCount', category.AnimalCount);

            row.innerHTML = `
                <td>${category.CategoryID}</td>
                <td>${category.DietType}</td>
                <td>${category.HabitatType}</td>
                <td>${category.AnimalCount}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function searchCategory() {
    const searchQuery = document.querySelector('.searchBar input').value.toLowerCase();
    const rows = document.querySelectorAll('#categoryTable tbody tr');
    let count = 0;

    rows.forEach(row => {
        const categoryID = row.getAttribute('data-categoryID').toLowerCase();  
        const dietType = row.getAttribute('data-DietType').toLowerCase();      
        const habitatType = row.getAttribute('data-HabitatType').toLowerCase();

     
        if (categoryID.includes(searchQuery) || dietType.includes(searchQuery) || habitatType.includes(searchQuery)) {
            row.style.display = ''; 
            count++;  
        } else {
            row.style.display = 'none';
        }
    });

    const resultCount = document.querySelector('.resultCount');
    resultCount.textContent = `${count}`;  
}


document.querySelector('.searchBar input').addEventListener('input', searchCategory);
window.onload = getCategory;



