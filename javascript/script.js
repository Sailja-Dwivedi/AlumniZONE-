
// API Configuration
// const API_BASE_URL = 'http://localhost:3000/api/auth';
const API_BASE_URL = `https://alumni-web-api.onrender.com/api/auth`;


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    const overlay = document.getElementById('overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    const Token = localStorage.getItem('Token');
    const userRole = localStorage.getItem('userRole');

    // Mobile menu toggle
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });

    // Login check
    if (Token && userRole) {
        console.log('User is logged in with role:', userRole);
        showDashboard(userRole);
    } else {
        console.log('No user session found');
        const mainContent = document.getElementById('mainContent');
        if (mainContent) mainContent.style.display = 'block';
    }
});


// Form Functions
function openForm() {
    document.getElementById("registerForm").style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
    resetRegistrationForm();
}

function closeForm() {
    document.getElementById("registerForm").style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
    resetRegistrationForm();
}

function resetRegistrationForm() {
    document.getElementById("userType").value = "";
    document.getElementById("universityName").classList.add("hidden");
    document.getElementById("universityName").required = false;
    document.getElementById("registrationForm").reset();
    document.getElementById("registerMessage").classList.add("hidden");
    document.getElementById("otpVerificationSection").classList.add("hidden");
    document.getElementById("registerOtpInput").classList.add("hidden");
    document.getElementById("submitRegisterBtn").classList.remove("hidden");
    document.getElementById("verifyRegisterOtpBtn").classList.add("hidden");
}

function toggleUniversityDropdown() {
    var userType = document.getElementById("userType").value;
    var universityDropdown = document.getElementById("universityName");

    if (userType === "alumni") {
        universityDropdown.classList.remove("hidden");
        universityDropdown.required = true;
    } else {
        universityDropdown.classList.add("hidden");
        universityDropdown.required = false;
    }
}

// Registration Functions
async function submitRegistration() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const phone = document.getElementById("registerPhone").value;
    const role = document.getElementById("userType").value;
    const university = document.getElementById("universityName").value;

    const registerMessage = document.getElementById("registerMessage");
    registerMessage.classList.add("hidden");

    // Basic validation
    if (!name || !email || !role) {
        showError(registerMessage, "Please fill all required fields");
        return;
    }

    if (role === "alumni" && !university) {
        showError(registerMessage, "Please select your university");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                role,
                university: role === 'alumni' ? university : undefined
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Show OTP verification section
            document.getElementById("otpVerificationSection").classList.remove("hidden");
            document.getElementById("registerOtpInput").classList.remove("hidden");
            document.getElementById("submitRegisterBtn").classList.add("hidden");
            document.getElementById("verifyRegisterOtpBtn").classList.remove("hidden");

            showSuccess(registerMessage, data.message || "OTP sent to your email!");
        } else {
            showError(registerMessage, data.message || "Registration failed!");
        }
    } catch (error) {
        showError(registerMessage, "Network error. Please try again.");
        console.error("Registration error:", error);
    }
}

async function verifyRegistrationOTP() {
    const email = document.getElementById("registerEmail").value;
    const otp = document.getElementById("registerOtpInput").value;
    const registerMessage = document.getElementById("registerMessage");
    registerMessage.classList.add("hidden");

    if (!otp) {
        showError(registerMessage, "Please enter the OTP");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            showSuccess(registerMessage, data.message || "Registration successful!");
            console.log(data)
            // Save token and role
            localStorage.setItem('Token', data.token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user._id)

            // Close the registration form
            closeForm();

            // Redirect after a short delay to allow UI updates
            setTimeout(() => {
                window.location.href = `html/${data.user.role.toLowerCase()}-updateProfile.html`;
            }, 500);

        } else {
            showError(registerMessage, data.message || "Invalid OTP!");
        }
    } catch (error) {
        showError(registerMessage, "Network error. Please try again.");
        console.error("OTP verification error:", error);
    }
}
// Login Functions
function openLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
    resetLoginForm();
}

function closeLoginForm() {
    document.getElementById("loginForm").style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
    resetLoginForm();
}

function resetLoginForm() {
    document.getElementById("otpInput").classList.add("hidden");
    document.getElementById("verifyOtpBtn").classList.add("hidden");
    document.getElementById("otpLoginForm").reset();
    document.getElementById("loginMessage").classList.add("hidden");
}

async function sendLoginOTP() {
    const email = document.getElementById("loginEmail").value;
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.classList.add("hidden");

    if (!email) {
        showError(loginMessage, "Please enter your email");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess(loginMessage, data.message || "OTP sent to your email!");
            document.getElementById("otpInput").classList.remove("hidden");
            document.getElementById("verifyOtpBtn").classList.remove("hidden");
        } else {
            showError(loginMessage, data.message || "Login failed!");
        }
    } catch (error) {
        showError(loginMessage, "Network error. Please try again.");
        console.error("Login error:", error);
    }
}

async function verifyLoginOTP() {
    const email = document.getElementById("loginEmail").value;
    const otp = document.getElementById("otpInput").value;
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.classList.add("hidden");

    if (!otp) {
        showError(loginMessage, "Please enter the OTP");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            showSuccess(loginMessage, data.message || "Login successful!");

            // Store token and role
            localStorage.setItem('Token', data.token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user._id)

            // Close login form
            closeLoginForm();
            updateNavbar();
            // Redirect based on user role
            redirectToRoleDashboard(data.user.role);

        } else {
            showError(loginMessage, data.message || "Invalid login!");
        }
    } catch (error) {
        showError(loginMessage, "Network error. Please try again.");
        console.error("OTP verification error:", error);
    }
}

// New function for role-based redirection
function redirectToRoleDashboard(role) {
    // Normalize the role for comparison
    const normalizedRole = String(role).toLowerCase().trim();

    // Map roles to their respective HTML files
    const rolePages = {
        'alumni': 'html/alumni-dashboard.html',
        'recruiter': 'html/recruiter-dashboard.html',
        'university_admin': 'html/university-dashboard.html',
        'suparadmin': 'html/superAdmin.html',
        'suparadmin': 'html/superAdmin.html'

    };

    // Get the appropriate page or default to main page
    const redirectPage = rolePages[normalizedRole];

    // Redirect after a short delay to allow UI updates
    setTimeout(() => {
        window.location.href = redirectPage;
    }, 500);
}

// Dashboard Functions
// function showDashboard(role) {
//     console.log('[showDashboard] Role received:', role);

//     // Hide all sections first
//     const sections = {
//         main: document.getElementById('mainContent'),
//         alumni: document.getElementById('alumniDashboard'),
//         recruiter: document.getElementById('recruiterDashboard'),
//         university: document.getElementById('universityDashboard')
//     };

//     // Hide all sections
//     Object.values(sections).forEach(section => {
//         if (section) section.style.display = 'none';
//     });

//     if (!role) {
//         console.warn('No role provided - showing main content');
//         if (sections.main) sections.main.style.display = 'block';
//         return;
//     }

//     // Normalize the role for comparison
//     const normalizedRole = String(role).toLowerCase().trim().replace(/_/g, '');
//     console.log(`Normalized role: ${normalizedRole}`);

//     switch (normalizedRole) {
//         case 'alumni':
//             if (sections.alumni) {
//                 sections.alumni.style.display = 'block';
//                 loadAlumniData();
//             } else {
//                 console.error('Alumni dashboard not found');
//                 fallbackToMain();
//             }
//             break;

//         case 'recruiter':
//             if (sections.recruiter) {
//                 sections.recruiter.style.display = 'block';
//                 loadRecruiterData();
//             } else {
//                 console.error('Recruiter dashboard not found');
//                 fallbackToMain();
//             }
//             break;

//         case 'university_admin':
//         case 'university_admin':
//             if (sections.university) {
//                 sections.university.style.display = 'block';
//                 loadUniversityData();
//             } else {
//                 console.error('University dashboard not found');
//                 fallbackToMain();
//             }
//             break;

//         default:
//             console.warn(`Unknown role: ${normalizedRole}`);
//             fallbackToMain();
//     }

//     function fallbackToMain() {
//         if (sections.main) sections.main.style.display = 'block';
//     }
// }

// Data Loading Functions
async function loadAlumniData() {
    try {
        console.log('Loading alumni data...');
        const response = await fetch(`${API_BASE_URL}/alumni/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Alumni data:', data);

        // Update UI
        if (document.getElementById('alumniName')) {
            document.getElementById('alumniName').textContent = data.name || 'Alumni';
        }
        if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = data.name || 'N/A';
        }
        if (document.getElementById('profileUniversity')) {
            document.getElementById('profileUniversity').textContent = data.university || 'N/A';
        }
        if (document.getElementById('profileYear')) {
            document.getElementById('profileYear').textContent = data.graduationYear || 'N/A';
        }

    } catch (error) {
        console.error('Error loading alumni data:', error);
        showError('alumniProfile', 'Failed to load profile data');
    }
}

async function loadUniversityData() {
    try {
        console.log('Loading university data...');
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('University data:', data);

        // Update UI
        if (document.getElementById('universityTitle')) {
            document.getElementById('universityTitle').textContent = data.name || 'University';
        }
        if (document.getElementById('uniName')) {
            document.getElementById('uniName').textContent = data.name || 'N/A';
        }
        if (document.getElementById('uniAlumniCount')) {
            document.getElementById('uniAlumniCount').textContent = data.alumniCount || '0';
        }

    } catch (error) {
        console.error('Error loading university data:', error);
        showError('universityProfile', 'Failed to load university data');
    }
}

function loadRecruiterData() {
    // Implement recruiter data loading as needed
    console.log('Loading recruiter data...');
}

// Utility Functions
function showError(element, message) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.textContent = message;
        element.classList.remove('success', 'hidden');
        element.classList.add('error');
    }
}

function showSuccess(element, message) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.textContent = message;
        element.classList.remove('error', 'hidden');
        element.classList.add('success');
    }
}

function logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Close forms when clicking on overlay
if (overlay) {
    overlay.addEventListener('click', () => {
        closeForm();
        closeLoginForm();
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ✅ Function to update navbar based on login status
function updateNavbar() {
    const token = localStorage.getItem('Token');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');

    if (token) {
        // User is LOGGED IN → Show Profile/Logout, Hide Login/Register
        profileLink.classList.remove('hidden');
        logoutLink.classList.remove('hidden');
        loginLink.classList.add('hidden');
        registerLink.classList.add('hidden');
        // logoutLink.classList.remove('hidden');

    } else {
        // User is LOGGED OUT → Hide Profile/Logout, Show Login/Register
        profileLink.classList.add('hidden');
        logoutLink.classList.add('hidden');
        loginLink.classList.remove('hidden');
        registerLink.classList.remove('hidden');
    }
}

// ✅ Call this on page load AND after login/logout
document.addEventListener('DOMContentLoaded', function () {
    updateNavbar(); // Check login status on load
});

// ✅ Redirect "My Profile" to the correct dashboard
document.getElementById('profileLink').addEventListener('click', function (e) {
    e.preventDefault();
    const userRole = localStorage.getItem('userRole');
    redirectToRoleDashboard(userRole); // Use existing function
});

// ✅ Logout function (already exists in your script)
function logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html'; // Redirect to homepage
}