const loginForm = document.getElementById('login-form');


loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    
    // Credentials
    const validUsername = 'admin';
    const validPassword = 'admin123';

    if (usernameInput === validUsername && passwordInput === validPassword) {
        
        localStorage.setItem('isLoggedIn', 'true');
        
        window.location.href = "dashboard.html";
    } else {
        
        alert('Invalid Username or Password! Please try again.');
    }
});