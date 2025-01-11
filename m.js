document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const startContainer = document.getElementById('start-container');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const startButton = document.getElementById('start-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const closeBtns = document.querySelectorAll('.close');
    const cancelBtns = document.querySelectorAll('.cancelbtn');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameSpan = document.getElementById('username');

    // Function to show sections (for content page)
    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide mobile menu after selection
        if (window.innerWidth <= 1024) {
            navLinks.classList.remove('show');
        }
    }

    // Add event listeners for navigation
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('data-section');
            showSection(section);
        });
    });

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Function to switch containers
    function showContainer(containerId) {
        [startContainer, loginContainer, signupContainer].forEach(container => {
            if (container) container.style.display = 'none';
        });
        const containerToShow = document.getElementById(containerId);
        if (containerToShow) {
            containerToShow.style.display = 'block';
            if (containerId === 'start-container') {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    }

    // Start button click handler
    if (startButton) {
        startButton.addEventListener('click', function() {
            showContainer('login-container');
        });
    }

    // Switch between login and signup
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showContainer('login-container');
        });
    }

    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showContainer('signup-container');
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('uname').value.trim();
            const password = document.getElementById('psw').value;
            
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({
                    username: user.username,
                    email: user.email
                }));
                window.location.href = 'content.html';
            } else {
                showNotification('Invalid username or password', 'error');
            }
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('newUsername').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!username || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Validate password strength
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.username === username)) {
                showNotification('Username already exists', 'error');
                return;
            }

            if (users.some(u => u.email === email)) {
                showNotification('Email already registered', 'error');
                return;
            }

            const newUser = {
                username,
                email,
                password
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            showNotification('Registration successful! Please login.', 'success');
            
            // Clear form and switch to login
            signupForm.reset();
            showContainer('login-container');
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'm.html';
        });
    }

    // Modal close handlers
    const closeModal = function() {
        showContainer('start-container');
    };

    closeBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    cancelBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize based on current page
    const isContentPage = window.location.pathname.includes('content.html');
    if (isContentPage) {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'm.html';
        } else {
            // Display username
            const user = JSON.parse(currentUser);
            if (usernameSpan) {
                usernameSpan.textContent = `Welcome, ${user.username}!`;
            }
        }
        // Show home section by default
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
        }
    } else {
        // For main page, show start container
        showContainer('start-container');
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            transform: translateX(120%);
            transition: transform 0.3s ease-out;
            z-index: 9999;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background-color: rgba(76, 175, 80, 0.9);
        }
        
        .notification.error {
            background-color: rgba(244, 67, 54, 0.9);
        }
        
        .notification.info {
            background-color: rgba(33, 150, 243, 0.9);
        }
    `;
    document.head.appendChild(style);
});