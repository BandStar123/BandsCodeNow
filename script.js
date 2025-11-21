document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startVerificationBtn = document.getElementById('start-verification');
    const humanVerifyBtn = document.getElementById('human-verify');
    const copyKeyBtn = document.getElementById('copy-key');
    const keyOutput = document.querySelector('.key-output');
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        keyDisplay: document.getElementById('key-display')
    };

    // Show step function
    function showStep(stepToShow) {
        // Hide all steps first
        Object.values(steps).forEach(step => {
            if (step) step.classList.add('hidden');
        });
        // Show the requested step
        if (steps[stepToShow]) {
            steps[stepToShow].classList.remove('hidden');
        }
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

    // Start verification process
    if (startVerificationBtn) {
        startVerificationBtn.addEventListener('click', () => {
            showStep('step2');
        });
    }

    // Human verification
    if (humanVerifyBtn) {
        humanVerifyBtn.addEventListener('click', () => {
            showStep('step3');
            
            // Start 10-second countdown
            let seconds = 10;
            const timerElement = document.querySelector('.timer');
            
            const countdown = setInterval(() => {
                seconds--;
                timerElement.textContent = `${seconds}s`;
                
                if (seconds <= 0) {
                    clearInterval(countdown);
                    showStep('step4');
                    
                    // Simulate key generation after a short delay
                    setTimeout(() => {
                        const key = generateKey();
                        keyOutput.textContent = key;
                        showStep('keyDisplay');
                    }, 1500);
                }
            }, 1000);
        });
    }

    // Copy key to clipboard
    if (copyKeyBtn) {
        copyKeyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(keyOutput.textContent).then(() => {
                const originalText = copyKeyBtn.textContent;
                copyKeyBtn.textContent = 'Copied!';
                copyKeyBtn.style.background = '#00b894';
                
                setTimeout(() => {
                    copyKeyBtn.textContent = originalText;
                    copyKeyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy key: ', err);
            });
        });
    }

    // Add hover effects to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add animation to premium button
    const premiumBtn = document.querySelector('.btn-premium');
    if (premiumBtn) {
        premiumBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Premium purchase would be processed here!');
        });
    }
});
