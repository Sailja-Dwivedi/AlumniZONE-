// // config.js - API Configuration
// const API_BASE_URL = 'https://alumni-web-api.onrender.com/api/auth';

// // auth.js - Authentication Functions
// class AuthService {
//   static getAuthToken() {
//     return localStorage.getItem('authToken');
//   }

//   static getUserRole() {
//     return localStorage.getItem('userRole');
//   }

//   static setAuthData(token, role) {
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('userRole', role);
//   }

//   static clearAuthData() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userRole');
//   }

//   static isAuthenticated() {
//     return !!this.getAuthToken();
//   }
// }

// // ui.js - UI Helper Functions
// class UIHelper {
//   static showError(element, message) {
//     if (typeof element === 'string') {
//       element = document.getElementById(element);
//     }
//     if (element) {
//       element.textContent = message;
//       element.classList.remove('success', 'hidden');
//       element.classList.add('error');
//     }
//   }

//   static showSuccess(element, message) {
//     if (typeof element === 'string') {
//       element = document.getElementById(element);
//     }
//     if (element) {
//       element.textContent = message;
//       element.classList.remove('error', 'hidden');
//       element.classList.add('success');
//     }
//   }

//   static toggleElement(element, show) {
//     if (element) {
//       element.style.display = show ? 'block' : 'none';
//     }
//   }

//   static setupMobileMenu() {
//     const mobileMenu = document.getElementById('mobile-menu');
//     const navLinks = document.getElementById('nav-links');
//     const overlay = document.getElementById('overlay');

//     if (mobileMenu && navLinks && overlay) {
//       mobileMenu.addEventListener('click', () => {
//         navLinks.classList.toggle('show');
//         overlay.classList.toggle('active');
//       });

//       overlay.addEventListener('click', () => {
//         navLinks.classList.remove('show');
//         overlay.classList.remove('active');
//       });
//     }
//   }
// }

// // form-validations.js - Form Validation Functions
// class FormValidator {
//   static validateEmail(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   }

//   static validatePhone(phone) {
//     return !phone || /^[0-9]{10,15}$/.test(phone);
//   }

//   static validateOTP(otp) {
//     return /^[0-9]{6}$/.test(otp);
//   }

//   static sanitizeInput(input) {
//     return input.trim();
//   }
// }

// // dashboard.js - Dashboard Functions
// class DashboardManager {
//   static showDashboard(role) {
//     // Hide all sections first
//     const sections = {
//       main: document.getElementById('mainContent'),
//       alumni: document.getElementById('alumniDashboard'),
//       recruiter: document.getElementById('recruiterDashboard'),
//       university: document.getElementById('universityDashboard')
//     };

//     Object.values(sections).forEach(section => {
//       if (section) section.style.display = 'none';
//     });

//     if (!role) {
//       if (sections.main) sections.main.style.display = 'block';
//       return;
//     }

//     // Normalize the role
//     role = role.toLowerCase();

//     switch (role) {
//       case 'alumni':
//         if (sections.alumni) {
//           sections.alumni.style.display = 'block';
//           this.loadAlumniData();
//         }
//         break;

//       case 'recruiter':
//         if (sections.recruiter) {
//           sections.recruiter.style.display = 'block';
//           this.loadRecruiterData();
//           document.querySelector('.dashboard-header').classList.add('recruiter');
//         }
//         break;

//       case 'university_admin':
//         if (sections.university) {
//           sections.university.style.display = 'block';
//           this.loadUniversityData();
//           document.querySelector('.dashboard-header').classList.add('university');
//         }
//         break;

//       default:
//         if (sections.main) sections.main.style.display = 'block';
//     }
//   }

//   static async loadAlumniData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/alumni/profile`, {
//         headers: {
//           'Authorization': `Bearer ${AuthService.getAuthToken()}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         this.updateAlumniUI(data);
//       }
//     } catch (error) {
//       console.error('Error loading alumni data:', error);
//       UIHelper.showError('alumniProfile', 'Failed to load profile data');
//     }
//   }

//   static updateAlumniUI(data) {
//     const elements = {
//       alumniName: data.name || 'Alumni',
//       profileName: data.name || 'N/A',
//       profileUniversity: data.university || 'N/A',
//       profileYear: data.graduationYear || 'N/A'
//     };

//     Object.entries(elements).forEach(([id, value]) => {
//       const element = document.getElementById(id);
//       if (element) element.textContent = value;
//     });
//   }

//   static async loadUniversityData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/university/profile`, {
//         headers: {
//           'Authorization': `Bearer ${AuthService.getAuthToken()}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         this.updateUniversityUI(data);
//       }
//     } catch (error) {
//       console.error('Error loading university data:', error);
//       UIHelper.showError('universityProfile', 'Failed to load university data');
//     }
//   }

//   static updateUniversityUI(data) {
//     const elements = {
//       universityTitle: data.name || 'University',
//       uniName: data.name || 'N/A',
//       uniAlumniCount: data.alumniCount || '0'
//     };

//     Object.entries(elements).forEach(([id, value]) => {
//       const element = document.getElementById(id);
//       if (element) element.textContent = value;
//     });
//   }

//   static async loadRecruiterData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/recruiter/profile`, {
//         headers: {
//           'Authorization': `Bearer ${AuthService.getAuthToken()}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Recruiter data loaded:', data);
//         // Update recruiter UI here
//       }
//     } catch (error) {
//       console.error('Error loading recruiter data:', error);
//     }
//   }
// }

// // form-handlers.js - Form Handling Functions
// class FormHandlers {
//   static init() {
//     // Registration Form
//     document.getElementById('userType')?.addEventListener('change', this.toggleUniversityDropdown);
//     document.getElementById('registerOtpInput')?.addEventListener('input', this.restrictToNumbers);
//     document.getElementById('otpInput')?.addEventListener('input', this.restrictToNumbers);
//   }

//   static toggleUniversityDropdown() {
//     const userType = document.getElementById('userType').value;
//     const universityDropdown = document.getElementById('universityName');

//     if (userType === 'alumni') {
//       universityDropdown.classList.remove('hidden');
//       universityDropdown.required = true;
//     } else {
//       universityDropdown.classList.add('hidden');
//       universityDropdown.required = false;
//     }
//   }

//   static restrictToNumbers(e) {
//     e.target.value = e.target.value.replace(/[^0-9]/g, '');
//   }

//   static async submitRegistration() {
//     const name = FormValidator.sanitizeInput(document.getElementById('registerName').value);
//     const email = FormValidator.sanitizeInput(document.getElementById('registerEmail').value);
//     const phone = FormValidator.sanitizeInput(document.getElementById('registerPhone').value);
//     const role = document.getElementById('userType').value;
//     const university = document.getElementById('universityName').value;

//     const registerMessage = document.getElementById('registerMessage');
//     registerMessage.classList.add('hidden');

//     // Validation
//     if (!name || !email || !role) {
//       UIHelper.showError(registerMessage, 'Please fill all required fields');
//       return;
//     }

//     if (!FormValidator.validateEmail(email)) {
//       UIHelper.showError(registerMessage, 'Please enter a valid email address');
//       return;
//     }

//     if (!FormValidator.validatePhone(phone)) {
//       UIHelper.showError(registerMessage, 'Please enter a valid phone number');
//       return;
//     }

//     if (role === 'alumni' && !university) {
//       UIHelper.showError(registerMessage, 'Please select your university');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           role,
//           university: role === 'alumni' ? university : undefined
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         document.getElementById('otpVerificationSection').classList.remove('hidden');
//         document.getElementById('registerOtpInput').classList.remove('hidden');
//         document.getElementById('submitRegisterBtn').classList.add('hidden');
//         document.getElementById('verifyRegisterOtpBtn').classList.remove('hidden');

//         UIHelper.showSuccess(registerMessage, data.message || 'OTP sent to your email!');
//       } else {
//         UIHelper.showError(registerMessage, data.message || 'Registration failed!');
//       }
//     } catch (error) {
//       UIHelper.showError(registerMessage, 'Network error. Please try again.');
//       console.error('Registration error:', error);
//     }
//   }

//   static async verifyRegistrationOTP() {
//     const email = document.getElementById('registerEmail').value;
//     const otp = document.getElementById('registerOtpInput').value;
//     const registerMessage = document.getElementById('registerMessage');
//     registerMessage.classList.add('hidden');

//     if (!FormValidator.validateOTP(otp)) {
//       UIHelper.showError(registerMessage, 'Please enter a valid 6-digit OTP');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/verify-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, otp })
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         UIHelper.showSuccess(registerMessage, data.message || 'Registration successful!');
//         AuthService.setAuthData(data.token, data.user.role);
//         closeForm();

//         setTimeout(() => {
//           window.location.href = `html/${data.user.role.toLowerCase()}-updateProfile.html`;
//         }, 500);
//       } else {
//         UIHelper.showError(registerMessage, data.message || 'Invalid OTP!');
//       }
//     } catch (error) {
//       UIHelper.showError(registerMessage, 'Network error. Please try again.');
//       console.error('OTP verification error:', error);
//     }
//   }

//   static async sendLoginOTP() {
//     const email = FormValidator.sanitizeInput(document.getElementById('loginEmail').value);
//     const loginMessage = document.getElementById('loginMessage');
//     loginMessage.classList.add('hidden');

//     if (!email) {
//       UIHelper.showError(loginMessage, 'Please enter your email');
//       return;
//     }

//     if (!FormValidator.validateEmail(email)) {
//       UIHelper.showError(loginMessage, 'Please enter a valid email address');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         UIHelper.showSuccess(loginMessage, data.message || 'OTP sent to your email!');
//         document.getElementById('otpInput').classList.remove('hidden');
//         document.getElementById('verifyOtpBtn').classList.remove('hidden');
//       } else {
//         UIHelper.showError(loginMessage, data.message || 'Login failed!');
//       }
//     } catch (error) {
//       UIHelper.showError(loginMessage, 'Network error. Please try again.');
//       console.error('Login error:', error);
//     }
//   }

//   static async verifyLoginOTP() {
//     const email = document.getElementById('loginEmail').value;
//     const otp = document.getElementById('otpInput').value;
//     const loginMessage = document.getElementById('loginMessage');
//     loginMessage.classList.add('hidden');

//     if (!FormValidator.validateOTP(otp)) {
//       UIHelper.showError(loginMessage, 'Please enter a valid 6-digit OTP');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/verify-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, otp })
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         UIHelper.showSuccess(loginMessage, data.message || 'Login successful!');
//         AuthService.setAuthData(data.token, data.user.role);
//         closeLoginForm();
//         DashboardManager.showDashboard(data.user.role);
//       } else {
//         UIHelper.showError(loginMessage, data.message || 'Invalid login!');
//       }
//     } catch (error) {
//       UIHelper.showError(loginMessage, 'Network error. Please try again.');
//       console.error('OTP verification error:', error);
//     }
//   }
// }

// // app.js - Main Application Initialization
// document.addEventListener('DOMContentLoaded', function () {
//   // Initialize UI components
//   UIHelper.setupMobileMenu();
//   FormHandlers.init();

//   // Check authentication status
//   if (AuthService.isAuthenticated()) {
//     DashboardManager.showDashboard(AuthService.getUserRole());
//   }

//   // Set up event listeners
//   document.getElementById('submitRegisterBtn')?.addEventListener('click', FormHandlers.submitRegistration);
//   document.getElementById('verifyRegisterOtpBtn')?.addEventListener('click', FormHandlers.verifyRegistrationOTP);
//   document.getElementById('verifyOtpBtn')?.addEventListener('click', FormHandlers.verifyLoginOTP);
//   document.querySelector('.btn[onclick="sendLoginOTP()"]')?.addEventListener('click', FormHandlers.sendLoginOTP);
//   document.querySelector('.btn[onclick="logout()"]')?.addEventListener('click', AuthService.clearAuthData);
// });

// // Helper functions for HTML onclick handlers
// function openForm() {
//   document.getElementById('registerForm').style.display = 'block';
//   document.getElementById('overlay').style.display = 'block';
//   document.body.style.overflow = 'hidden';
//   resetRegistrationForm();
// }

// function closeForm() {
//   document.getElementById('registerForm').style.display = 'none';
//   document.getElementById('overlay').style.display = 'none';
//   document.body.style.overflow = 'auto';
//   resetRegistrationForm();
// }

// function resetRegistrationForm() {
//   document.getElementById('userType').value = '';
//   document.getElementById('universityName').classList.add('hidden');
//   document.getElementById('universityName').required = false;
//   document.getElementById('registrationForm').reset();
//   document.getElementById('registerMessage').classList.add('hidden');
//   document.getElementById('otpVerificationSection').classList.add('hidden');
//   document.getElementById('registerOtpInput').classList.add('hidden');
//   document.getElementById('submitRegisterBtn').classList.remove('hidden');
//   document.getElementById('verifyRegisterOtpBtn').classList.add('hidden');
// }

// function openLoginForm() {
//   document.getElementById('loginForm').style.display = 'block';
//   document.getElementById('overlay').style.display = 'block';
//   document.body.style.overflow = 'hidden';
//   resetLoginForm();
// }

// function closeLoginForm() {
//   document.getElementById('loginForm').style.display = 'none';
//   document.getElementById('overlay').style.display = 'none';
//   document.body.style.overflow = 'auto';
//   resetLoginForm();
// }

// function resetLoginForm() {
//   document.getElementById('otpInput').classList.add('hidden');
//   document.getElementById('verifyOtpBtn').classList.add('hidden');
//   document.getElementById('otpLoginForm').reset();
//   document.getElementById('loginMessage').classList.add('hidden');
// }

// function logout() {
//   AuthService.clearAuthData();
//   window.location.href = 'index.html';
// }