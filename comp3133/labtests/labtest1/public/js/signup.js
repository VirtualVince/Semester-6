$(document).ready(function() {
    const currentUser = localStorage.getItem('chatUser');
    if (currentUser) {
        window.location.href = '/chat';
    }

    // Handle form submission
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const firstname = $('#firstname').val().trim();
        const lastname = $('#lastname').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        $('#alert-container').empty();

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }

        if (username.length < 3) {
            showAlert('Username must be at least 3 characters', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters', 'danger');
            return;
        }

        // Disable submit button
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Creating account...');

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                firstname,
                lastname,
                password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                showAlert(data.message || 'Signup failed', 'danger');
                submitBtn.prop('disabled', false).text('Sign Up');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred during signup. Please try again.', 'danger');
            submitBtn.prop('disabled', false).text('Sign Up');
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

    // Real-time validation
    $('#username').on('input', function() {
        const val = $(this).val();
        if (val.length > 0 && val.length < 3) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $('#password').on('input', function() {
        const val = $(this).val();
        if (val.length > 0 && val.length < 6) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $('#confirm-password').on('input', function() {
        const password = $('#password').val();
        const confirmPassword = $(this).val();
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
});