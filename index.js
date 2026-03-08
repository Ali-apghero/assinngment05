const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // .trim() handles accidental spaces at the start/end
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    
    // Credentials
    const validUsername = 'admin';
    const validPassword = 'admin123';

    if (usernameInput === validUsername && passwordInput === validPassword) {
        // Optional: Store a "session" flag in localStorage 
        // to check if the user is logged in on dashboard.html
        localStorage.setItem('isLoggedIn', 'true');
        
        window.location.href = "dashboard.html";
    } else {
        // Better UX: You could toggle a hidden 'error-message' div instead of an alert
        alert('Invalid Username or Password! Please try again.');
    }
});