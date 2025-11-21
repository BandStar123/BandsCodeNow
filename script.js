document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const fullTimePage = document.getElementById('full-time-page');
    const premiumPage = document.getElementById('premium-page');
    const freeKeyPage = document.getElementById('free-key-page');
    
    // Full Time Key Elements
    const fullTimeKeyBtn = document.querySelector('#full-time-key .btn');
    const purchaseFtBtn = document.getElementById('purchase-ft');
    const copyFtBtn = document.getElementById('copy-ft');
    const fullTimeKeyDisplay = document.getElementById('full-time-key-generated');
    
    // Premium Account Elements
    const premiumAccountBtn = document.querySelector('#premium-account .btn');
    const createPremiumBtn = document.getElementById('create-premium');
    const premiumEmail = document.getElementById('premium-email');
    const premiumPassword = document.getElementById('premium-password');
    const premiumConfirm = document.getElementById('premium-confirm');
    const premiumSignup = document.getElementById('premium-signup');
    const premiumSuccess = document.getElementById('premium-success');
    const premiumLoginBtn = document.getElementById('premium-login');
    
    // Free Key Elements
    const freeKeyBtn = document.querySelector('#free-key .btn');
    const verifyStep = document.getElementById('step-verify');
    const countdownStep = document.getElementById('step-countdown');
    const keyStep = document.getElementById('step-key');
    const countdownNumber = document.querySelector('.countdown-number');
    const progressBar = document.querySelector('.progress');
    const freeKeyDisplay = document.getElementById('free-key-generated');
    const copyFreeBtn = document.getElementById('copy-free');
    const doneFreeBtn = document.getElementById('done-free');
    
    // Back Buttons
    const backButtons = document.querySelectorAll('.btn-back');
    
    // Notification
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    
    // State
    let countdownInterval;
    let timeLeft = 300; // 5 minutes in seconds
    
    // Initialize the app
    initApp();
    
    function initApp() {
        // Initialize event listeners
        if (fullTimeKeyBtn) fullTimeKeyBtn.addEventListener('click', () => showPage('full-time'));
        if (premiumAccountBtn) premiumAccountBtn.addEventListener('click', () => showPage('premium'));
        if (freeKeyBtn) freeKeyBtn.addEventListener('click', () => showPage('free-key'));
        
        // Full Time Key Events
        if (purchaseFtBtn) purchaseFtBtn.addEventListener('click', handleFullTimePurchase);
        if (copyFtBtn) copyFtBtn.addEventListener('click', () => copyToClipboard(fullTimeKeyDisplay, 'Full Time Key'));
        
        // Premium Account Events
        if (createPremiumBtn) createPremiumBtn.addEventListener('click', handlePremiumSignup);
        if (premiumLoginBtn) premiumLoginBtn.addEventListener('click', () => showPage('premium'));
        if (premiumPassword) premiumPassword.addEventListener('input', checkPasswordStrength);
        
        // Free Key Events
        if (freeKeyBtn) freeKeyBtn.addEventListener('click', startVerification);
        if (copyFreeBtn) copyFreeBtn.addEventListener('click', () => copyToClipboard(freeKeyDisplay, 'Free Key'));
        if (doneFreeBtn) doneFreeBtn.addEventListener('click', () => showPage('main'));
        
        // Back Buttons
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => showPage('main'));
        });
        
        // Toggle Password Visibility
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Show/Hide Pages
    function showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        switch(page) {
            case 'main':
                mainMenu.classList.add('active');
                break;
            case 'full-time':
                fullTimePage.classList.add('active');
                break;
            case 'premium':
                premiumPage.classList.add('active');
                premiumSignup.classList.remove('hidden');
                premiumSuccess.classList.add('hidden');
                break;
            case 'free-key':
                freeKeyPage.classList.add('active');
                resetFreeKeyFlow();
                break;
        }
    }
    
    // Full Time Key Functions
    function handleFullTimePurchase(e) {
        e.preventDefault();
        const email = document.getElementById('email-ft').value.trim();
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // In a real app, you would process the payment here
        // For demo, we'll just generate a key
        showLoading(purchaseFtBtn, 'Processing...');
        
        setTimeout(() => {
            hideLoading(purchaseFtBtn, 'Purchase for $29.99');
            document.querySelector('.payment-form').classList.add('hidden');
            
            // Generate and display key
            const key = generateKey();
            fullTimeKeyDisplay.textContent = key;
            document.getElementById('key-generated-ft').classList.remove('hidden');
            
            showNotification('Purchase successful! Your key has been generated.', 'success');
        }, 2000);
    }
    
    // Premium Account Functions
    function handlePremiumSignup(e) {
        e.preventDefault();
        
        const email = premiumEmail.value.trim();
        const password = premiumPassword.value;
        const confirmPassword = premiumConfirm.value;
        
        // Validate inputs
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (!validatePassword(password)) {
            showNotification('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // In a real app, you would send this to your server
        showLoading(createPremiumBtn, 'Creating Account...');
        
        setTimeout(() => {
            hideLoading(createPremiumBtn, 'Create Premium Account ($9.99/month)');
            
            // Show success message
            premiumSignup.classList.add('hidden');
            premiumSuccess.classList.remove('hidden');
            
            showNotification('Premium account created successfully!', 'success');
            
            // In a real app, you would log the user in automatically
        }, 2000);
    }
    
    // Free Key Functions
    function startVerification() {
        showPage('free-key');
        
        // Simulate verification process
        setTimeout(() => {
            verifyStep.classList.add('hidden');
            countdownStep.classList.remove('hidden');
            startCountdown();
        }, 2000);
    }
    
    function startCountdown() {
        updateCountdown();
        
        countdownInterval = setInterval(() => {
            timeLeft--;
            updateCountdown();
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                showKey();
            }
        }, 1000);
    }
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownNumber.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Update progress bar
        const progress = ((300 - timeLeft) / 300) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    function showKey() {
        countdownStep.classList.add('hidden');
        keyStep.classList.remove('hidden');
        
        // Generate and display key
        const key = generateKey();
        freeKeyDisplay.textContent = key;
        
        showNotification('Your free key has been generated!', 'success');
    }
    
    function resetFreeKeyFlow() {
        // Reset steps
        verifyStep.classList.remove('hidden');
        countdownStep.classList.add('hidden');
        keyStep.classList.add('hidden');
        
        // Reset countdown
        clearInterval(countdownInterval);
        timeLeft = 300;
        countdownNumber.textContent = '5:00';
        progressBar.style.width = '0%';
    }
    
    // Utility Functions
    function generateKey() {
        // Generate a random key in the format XXXX-XXXX-XXXX-XXXX
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let key = '';
        
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) key += '-';
            key += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return key;
    }
    
    function copyToClipboard(element, keyName) {
        const textToCopy = element.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification(`${keyName} copied to clipboard!`, 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    }
    
    function checkPasswordStrength() {
        const password = premiumPassword.value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text span');
        
        // Reset
        let strength = 0;
        let color = '#e74c3c';
        let text = 'Weak';
        
        // Check password strength
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
        
        // Update UI based on strength
        switch(strength) {
            case 0:
            case 1:
                color = '#e74c3c';
                text = 'Very Weak';
                break;
            case 2:
                color = '#f39c12';
                text = 'Weak';
                break;
            case 3:
                color = '#f1c40f';
                text = 'Moderate';
                break;
            case 4:
                color = '#2ecc71';
                text = 'Strong';
                break;
            case 5:
                color = '#27ae60';
                text = 'Very Strong';
                break;
        }
        
        // Update the UI
        strengthBar.style.width = `${(strength / 5) * 100}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    function showNotification(message, type = 'info') {
        notificationMessage.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    function showLoading(button, text) {
        button.disabled = true;
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    }
    
    function hideLoading(button, text) {
        button.disabled = false;
        button.textContent = text;
    }
    
    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Password strength checker
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Check password length
        if (password.length >= 8) strength += 1;
        
        // Check for uppercase letters
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Check for numbers
        if (/\d/.test(password)) strength += 1;
        
        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update UI
        updateStrengthMeter(strength);
    }
    
    function updateStrengthMeter(strength) {
        const strengthClasses = ['very-weak', 'weak', 'moderate', 'strong', 'very-strong'];
        const strengthTexts = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1dd1a1'];
        
        // Ensure strength is within bounds
        strength = Math.min(Math.max(0, strength), 4);
        
        // Update the strength bar
        const percentage = (strength / 4) * 100;
        strengthBar.style.width = `${percentage}%`;
        strengthBar.style.backgroundColor = strengthColors[strength];
        
        // Update the text
        strengthText.textContent = strengthTexts[strength];
        strengthText.style.color = strengthColors[strength];
    }
    
    // Toggle password visibility
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
    
    // Handle form submissions
    function handleSignup(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Reset errors
        clearError('email-error');
        clearError('password-error');
        clearError('confirm-password-error');
        
        // Validate email
        if (!validateEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            return;
        }
        
        // Validate password
        if (!validatePassword(password)) {
            showError('password-error', 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            return;
        }
        
        // Save user data
        userData.email = email;
        userData.password = password; // In a real app, you would hash this
        
        // Move to next step
        showStep(2);
    }
    
    function handlePayment(e) {
        e.preventDefault();
        
        // In a real app, you would process the payment here
        // For demo purposes, we'll just generate a key
        showStep(5);
        
        // Simulate key generation with progress
        let progress = 0;
        const progressBar = document.querySelector('.progress');
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => showStep(6), 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
        
        // Generate and display key
        const key = generateKey();
        generatedKey.textContent = key;
        userData.key = key;
    }
    
    function skipVerification() {
        // Skip to plan selection
        showStep(3);
    }
    
    // Generate a random key
    function generateKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) key += '-';
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }
    
    // Copy key to clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(generatedKey.textContent).then(() => {
            // Show success feedback
            showNotification('Key copied to clipboard!', 'success');
            
            // Change icon to checkmark temporarily
            const icon = copyKeyBtn.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            
            // Revert after 2 seconds
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy key: ', err);
            showNotification('Failed to copy key', 'error');
        });
    }
    
    // Plan selection
    function initPlanSelection() {
        const planOptions = document.querySelectorAll('.plan-option');
        
        planOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                planOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update selected plan
                selectedPlan = option.getAttribute('data-plan');
                userData.plan = selectedPlan;
                
                // Show payment form if not free plan
                if (selectedPlan !== 'free') {
                    showStep(4);
                } else {
                    // For free plan, skip to key generation
                    handlePayment({ preventDefault: () => {} });
                }
            });
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.querySelector('.notifications').appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Show/hide steps
    function showStep(stepNumber) {
        currentStep = stepNumber;
        
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('hidden');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            currentStepElement.classList.add('active');
            
            // Add animation
            currentStepElement.style.animation = 'fadeIn 0.5s ease-out';
            
            // Scroll to top of step
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Initialize animations
    function initAnimations() {
        // Add fade-in animation to elements with the 'fade-in' class
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
});
