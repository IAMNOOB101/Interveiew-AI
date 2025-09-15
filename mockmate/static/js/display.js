// user-display.js - This will be included in all pages
document.addEventListener("DOMContentLoaded", function() {
    // Update username in sidebar and navbar
    function updateUserDisplay() {
        const storedFirstName = localStorage.getItem('userFirstName');
        const storedLastName = localStorage.getItem('userLastName');
        
        // Update sidebar username
        const sidebarSpans = document.querySelectorAll('.sidebar .profile span');
        sidebarSpans.forEach(span => {
            if (storedFirstName) {
                span.textContent = storedLastName 
                    ? `${storedFirstName} ${storedLastName.charAt(0)}.` 
                    : storedFirstName;
            }
        });
        
        // Update navbar username if exists
        const navbarUsername = document.getElementById('navbar-username');
        if (navbarUsername && storedFirstName) {
            navbarUsername.textContent = storedFirstName;
        }
    }

    // Initialize user display
    updateUserDisplay();

    // Add logout functionality
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear all user-related data
            localStorage.removeItem('user');
            localStorage.removeItem('userFirstName');
            localStorage.removeItem('userLastName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('token');
        window.location.href = "/login";
        });
    });

    // Add theme toggle functionality if element exists
    const themeToggle = document.querySelector('.toggle-theme');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Highlight the active sidebar link based on current path
    function setupSidebarActive() {
        const path = window.location.pathname.replace(/\/$/, ''); // strip trailing slash
        const current = path.split('/').pop() || 'dashboard';
        document.querySelectorAll('.sidebar a').forEach(a => {
            // compare last segment of href
            try {
                const href = new URL(a.href, window.location.origin).pathname;
                const last = href.split('/').filter(Boolean).pop();
                if (last === current) {
                    a.parentElement.classList.add('active');
                } else {
                    a.parentElement.classList.remove('active');
                }
            } catch (e) {
                // ignore malformed hrefs
            }
        });
    }

    setupSidebarActive();
});