// Global variable to store the Bearer token received during authentication
let authToken = '';

// Function to authenticate user and get Bearer token
function authenticateUser() {
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the authentication API
    // Replace 'YOUR_AUTH_API_ENDPOINT' with the actual authentication API URL
    fetch('YOUR_AUTH_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "login_id": loginId,
            "password": password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        return response.json();
    })
    .then(data => {
        // Save the received Bearer token
        authToken = data.token;
        showCustomerListSection();
        loadCustomerList();
    })
    .catch(error => {
        console.error('Authentication error:', error);
        alert('Authentication failed. Please check your credentials and try again.');
    });
}

// Function to display the customer list section
function showCustomerListSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('customerListSection').style.display = 'block';
    document.getElementById('createCustomerSection').style.display = 'block';
}

// Function to load the list of customers
function loadCustomerList() {
    // Make a GET request to the API to get the list of customers
    // Replace 'YOUR_GET_CUSTOMER_LIST_API_ENDPOINT' with the actual API URL
    fetch('YOUR_GET_CUSTOMER_LIST_API_ENDPOINT', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customer list');
        }
        return response.json();
    })
    .then(data => {
        // Display the list of customers in the table
        const customerListBody = document.getElementById('customerListBody');
        customerListBody.innerHTML = '';
        data.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.first_name}</td>
                <td>${customer.last_name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><button onclick="selectCustomer('${customer.uuid}')">Select</button></td>
            `;
            customerListBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching customer list:', error);
        alert('Failed to fetch customer list. Please try again later.');
    });
}

// Function to create a new customer
function createCustomer() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!firstName || !lastName) {
        alert('First Name and Last Name are mandatory');
        return;
    }

    // Make a POST request to create a new customer
    // Replace 'YOUR_CREATE_CUSTOMER_API_ENDPOINT' with the actual API URL
    fetch('YOUR_CREATE_CUSTOMER_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            "cmd": "create",
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone
        })
    })
    .then(response => {
        if (response.status === 201) {
            // Customer created successfully
            alert('Customer created successfully.');
            loadCustomerList();
        } else if (response.status === 400) {
            // First Name or Last
