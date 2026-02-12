$(document).ready(function() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('chatUser');
    if (currentUser) {
        window.location.href = '/chat';
    }

    // Handle form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const password = $('#password').val();

        // Clear previous alerts
        $('#alert-container').empty();

        // Validation
        if (!username || !password) {
            showAlert('Please enter both username and password', 'danger');
            return;
        }

        // Disable submit button
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Logging in...');

        // Send login request
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('chatUser', JSON.stringify(data.user));
                
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/chat';
                }, 1000);
            } else {
                showAlert(data.message || 'Login failed', 'danger');
                submitBtn.prop('disabled', false).text('Login');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred during login. Please try again.', 'danger');
            submitBtn.prop('disabled', false).text('Login');
        });
    });

    // Helper function to show alerts
    function showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('#alert-container').html(alertHtml);
    }

    $('#username, #password').on('keypress', function(e) {
        if (e.which === 13) {
            $('#login-form').submit();
        }
    });
});