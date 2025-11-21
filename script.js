let generatedKeys = new Set();
let progressIntervals = {};

// Initialize particles.js for background
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00ffe7' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00ffe7',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const tooltipText = tooltip.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);
            
            const rect = tooltip.getBoundingClientRect();
            tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
            tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2)}px`;
            
            tooltip.tooltipEl = tooltipEl;
        });
        
        tooltip.addEventListener('mouseleave', () => {
            if (tooltip.tooltipEl) {
                tooltip.tooltipEl.remove();
                delete tooltip.tooltipEl;
            }
        });
    });
}

// Start progress for a task
function startProgress(task, duration, onComplete) {
    const progressBar = document.getElementById(`${task}Progress`);
    const progressText = document.getElementById(`${task}ProgressText`);
    const statusElement = document.getElementById(`${task}Status`);
    
    if (!progressBar) return;
    
    // Clear any existing interval
    if (progressIntervals[task]) {
        clearInterval(progressIntervals[task]);
    }
    
    let progress = 0;
    const interval = 50; // ms
    const totalSteps = duration / interval;
    const increment = 100 / totalSteps;
    
    progressBar.style.width = '0%';
    progressText.textContent = '0% Complete';
    statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    progressIntervals[task] = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressIntervals[task]);
            progressText.textContent = 'Task Complete';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
            statusElement.classList.add('completed');
            if (onComplete) onComplete();
        } else {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }, interval);
}

// Generate a random key
function generateKey() {
    const keyDisplay = document.getElementById('key');
    const placeholder = keyDisplay.querySelector('.key-placeholder');
    
    // Show loading animation
    placeholder.textContent = 'Generating your key...';
    
    // Simulate generation delay
    setTimeout(() => {
        let key;
        do {
            key = 'KEY-' + Math.random().toString(36).substr(2, 10).toUpperCase();
        } while (generatedKeys.has(key));
        
        generatedKeys.add(key);
        // Notify Discord bot (webhook)
        console.log('Sending webhook for key:', key);
        fetch('https://discord.com/api/webhooks/1441486535311753438/rk_Z6PfDjIK3FqG8BVLY53Ig8fWGUi2pYRBYAHWZhYyoUc855BnadulK-q-uhZcS0xhP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `A player created a free key: ${key}` })
        }).catch(err => console.error('Webhook error:', err));
        
        // Animate the key display
        placeholder.remove();
        keyDisplay.innerHTML = `<div class="key-text">${key}</div>`;
        keyDisplay.classList.add('generated');
        
        // Set expiration
        setTimeout(() => {
            generatedKeys.delete(key);
        }, 5 * 60 * 60 * 1000); // 5 hours
    }, 1500);
}

// Copy key to clipboard
function copyKey() {
    const keyDisplay = document.querySelector('.key-text');
    if (!keyDisplay) return;
    
    const key = keyDisplay.textContent;
    navigator.clipboard.writeText(key).then(() => {
        const button = document.querySelector('.action-button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Handle step navigation
function nextStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.add('hidden');
    });
    
    // Show the target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
    }
    
    // Handle step-specific logic
    switch(step) {
        case 2: // YouTube verification step
            startYouTubeVerification();
            break;
        case 5: // Discord verification step
            startDiscordVerification();
            break;
        case 7: // Final step - generate key
            generateKey();
            break;
    }
}

// Start YouTube verification process
function startYouTubeVerification() {
    const ytLink = document.getElementById('ytLink');
    const continueBtn = document.getElementById('continue2');
    
    // Reset state
    ytLink.classList.remove('verified');
    continueBtn.classList.add('hidden');
    
    // Handle link click
    ytLink.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.href;
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Start progress
        startProgress('yt', 10000, () => {
            // Enable continue button after completion
            continueBtn.classList.remove('hidden');
            ytLink.classList.add('verified');
        });
    });
}

// Start Discord verification process
function startDiscordVerification() {
    const discordLink = document.getElementById('discordLink');
    const continueBtn = document.getElementById('continue6');
    
    // Reset state
    discordLink.classList.remove('verified');
    continueBtn.classList.add('hidden');
    
    // Handle link click
    discordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.href;
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Start progress
        startProgress('discord', 10000, () => {
            // Enable continue button after completion
            continueBtn.classList.remove('hidden');
            discordLink.classList.add('verified');
        });
    });
}

// Verify human check
function verifyHuman() {
    const checkBox = document.getElementById('humanCheck');
    if (checkBox.checked) {
        // Add success animation
        checkBox.parentElement.classList.add('verified');
        setTimeout(() => nextStep(5), 800);
    } else {
        // Add error animation
        const verificationBox = checkBox.closest('.verification-box');
        verificationBox.classList.add('error');
        setTimeout(() => verificationBox.classList.remove('error'), 1000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    initTooltips();
    
    // Add click handlers for all continue buttons
    document.querySelectorAll('[onclick^="nextStep"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return false;
            }
        });
    });
    
    // Add animation for checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.classList.add('checked');
            } else {
                this.parentElement.classList.remove('checked');
            }
        });
    });
});
