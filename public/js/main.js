document.addEventListener('DOMContentLoaded', function() {
    // Example form handling for registration
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Retrieve form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        // Display form data in console (for debugging)
        console.log('Registration Data:', { email, password, name });

        // Here you can handle form submission, e.g., send data to server
    });

    // Example form handling for donation
    document.getElementById('donationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve form data
        const userId = document.getElementById('userId').value;
        const amount = document.getElementById('amount').value;
        const donationType = document.getElementById('donationType').value;

        // Display form data in console (for debugging)
        console.log('Donation Data:', { userId, amount, donationType });

        // Here you can handle form submission, e.g., send data to server
    });

    // Example form handling for volunteering
    document.getElementById('volunteerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve form data
        const userId = document.getElementById('userId').value;
        const opportunityId = document.getElementById('opportunityId').value;

        // Display form data in console (for debugging)
        console.log('Volunteer Data:', { userId, opportunityId });

        // Here you can handle form submission, e.g., send data to server
    });
});
