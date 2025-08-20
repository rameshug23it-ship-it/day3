// Advanced JavaScript Functions and Features

// Store project data in arrays
let registeredProjects = [];
let colorThemes = [
    { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
    { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#45b7d1' },
    { primary: '#96ceb4', secondary: '#ffeaa7', accent: '#dda0dd' },
    { primary: '#fd79a8', secondary: '#fdcb6e', accent: '#6c5ce7' }
];

// DOM Manipulation Functions
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// Form validation with advanced features
function validateForm() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        const errorDiv = document.getElementById(`${input.id}Error`);
        if (!input.value.trim()) {
            errorDiv.style.display = 'block';
            input.classList.add('error-input');
            isValid = false;
        } else {
            errorDiv.style.display = 'none';
            input.classList.remove('error-input');
        }
    });

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

// Advanced form submission with data storage
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            department: document.getElementById('department').value,
            year: document.getElementById('year').value,
            projectTitle: document.getElementById('projectTitle').value,
            timestamp: new Date().toISOString()
        };
        
        registeredProjects.push(formData);
        localStorage.setItem('registeredProjects', JSON.stringify(registeredProjects));
        
        showSuccessMessage();
        resetForm();
        updateProjectCounter();
    }
}

// Success message with animation
function showSuccessMessage() {
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'block';
    successDiv.style.animation = 'bounce 0.6s ease-out';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Reset form with smooth transition
function resetForm() {
    document.getElementById('registrationForm').reset();
    document.querySelectorAll('.error').forEach(error => error.style.display = 'none');
    document.querySelectorAll('input, select').forEach(field => {
        field.classList.remove('error-input');
    });
}

// Update project counter
function updateProjectCounter() {
    const counter = createElement('div', 'project-counter', `Total Projects: ${registeredProjects.length}`);
    counter.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 14px;
        box-shadow: var(--shadow-light);
        z-index: 1000;
    `;
    
    const existingCounter = document.querySelector('.project-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    document.body.appendChild(counter);
}

// Click Me button functionality
function createClickMeButton() {
    const button = createElement('button', 'click-me-btn', 'Click Me!');
    button.addEventListener('click', changeTheme);
    document.body.appendChild(button);
}

// Change theme with CSS variables
function changeTheme() {
    const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', randomTheme.primary);
    root.style.setProperty('--secondary-color', randomTheme.secondary);
    root.style.setProperty('--accent-color', randomTheme.accent);
    
    // Update gradient
    root.style.setProperty('--background-gradient', 
        `linear-gradient(135deg, ${randomTheme.primary} 0%, ${randomTheme.secondary} 100%)`);
    
    // Add animation effect
    document.body.style.animation = 'pulse 0.5s ease-out';
}

// Form validation on input change
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
}

function validateField(event) {
    const input = event.target;
    const errorDiv = document.getElementById(`${input.id}Error`);
    
    if (!input.value.trim()) {
        errorDiv.style.display = 'block';
        input.classList.add('error-input');
    } else {
        errorDiv.style.display = 'none';
        input.classList.remove('error-input');
    }
}

function clearError(event) {
    const input = event.target;
    const errorDiv = document.getElementById(`${input.id}Error`);
    errorDiv.style.display = 'none';
    input.classList.remove('error-input');
}

// Load saved projects from localStorage
function loadSavedProjects() {
    const saved = localStorage.getItem('registeredProjects');
    if (saved) {
        registeredProjects = JSON.parse(saved);
        updateProjectCounter();
    }
}

// Welcome alert
function showWelcomeAlert() {
    setTimeout(() => {
        alert('Welcome to Project Registration! Fill out the form to register your project.');
    }, 1000);
}

// Initialize all features
function initApp() {
    loadSavedProjects();
    addRealTimeValidation();
    createClickMeButton();
    showWelcomeAlert();
    
    // Add form submit listener
    document.getElementById('registrationForm').addEventListener('submit', handleFormSubmit);
}

// Advanced DOM manipulation - create dynamic elements
function createDynamicElements() {
    // Create floating particles
    for (let i = 0; i < 5; i++) {
        const particle = createElement('div', 'floating-particle');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${5 + Math.random() * 5}s linear infinite;
            left: ${Math.random() * 100}%;
            top: 100%;
            z-index: -1;
        `;
        document.body.appendChild(particle);
    }
}

// Add CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .error-input {
        border-color: var(--error-color) !important;
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Event listeners for multiple elements
function addEventListeners() {
    // Add hover effects to form elements
    document.querySelectorAll('input, select, button').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    createDynamicElements();
    addEventListeners();
});

// Export functions for global access
window.ProjectRegistration = {
    changeTheme,
    resetForm,
    showSuccessMessage,
    registeredProjects
};
