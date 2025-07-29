// src/main/resources/public/script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Get references to all HTML elements ---
    const addStudentForm = document.getElementById('addStudentForm');
    const addCompanyForm = document.getElementById('addCompanyForm');
    const placeStudentForm = document.getElementById('placeStudentForm');

    const studentList = document.getElementById('studentList');
    const companyList = document.getElementById('companyList');
    const studentSelect = document.getElementById('studentSelect');
    const companySelect = document.getElementById('companySelect');

    // --- Data Fetching Functions ---

    // Fetches all students and updates the UI
    async function fetchAndDisplayStudents() {
        const response = await fetch('/api/students');
        const students = await response.json();
        
        studentList.innerHTML = ''; // Clear existing list
        studentSelect.innerHTML = '<option value="">Select a Student</option>'; // Clear and reset dropdown
        
        students.forEach(s => {
            // Add to the main display list
            const li = document.createElement('li');
            li.innerHTML = `${s.name} (${s.major}) - <span>Status: ${s.placementStatus}</span>`;
            studentList.appendChild(li);

            // Add all students to the placement dropdown
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.name;
            studentSelect.appendChild(option);
        });
    }

    // Fetches all companies and updates the UI
    async function fetchAndDisplayCompanies() {
        const response = await fetch('/api/companies');
        const companies = await response.json();
        
        companyList.innerHTML = ''; // Clear existing list
        companySelect.innerHTML = '<option value="">Select a Company</option>'; // Clear and reset dropdown

        companies.forEach(c => {
            // Add to the main display list
            const li = document.createElement('li');
            li.textContent = `${c.name} (${c.industry})`;
            companyList.appendChild(li);
            
            // Add to the placement dropdown
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            companySelect.appendChild(option);
        });
    }

    // --- Form Submission Handlers ---

    // Handle "Add Student" form
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page refresh
        const name = document.getElementById('studentName').value;
        const major = document.getElementById('studentMajor').value;
        
        await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, major })
        });
        
        addStudentForm.reset(); // Clear the form
        fetchAndDisplayStudents(); // Refresh the student list
    });

    // Handle "Add Company" form
    addCompanyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('companyName').value;
        const industry = document.getElementById('companyIndustry').value;

        await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, industry })
        });

        addCompanyForm.reset();
        fetchAndDisplayCompanies(); // Refresh the company list
    });

    // Handle "Place Student" form
    placeStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = studentSelect.value;
        const companyId = companySelect.value;

        if (!studentId || !companyId) {
            alert('Please select both a student and a company.');
            return;
        }

        await fetch(`/api/placements?studentId=${studentId}&companyId=${companyId}`, {
            method: 'POST'
        });
        
        placeStudentForm.reset();
        // Refresh both lists to update student status and dropdowns
        fetchAndDisplayStudents();
        fetchAndDisplayCompanies();
    });

    // --- Initial Page Load ---
    // Fetch and display all data when the page first loads
    function initialize() {
        fetchAndDisplayStudents();
        fetchAndDisplayCompanies();
    }
    
    initialize();
});