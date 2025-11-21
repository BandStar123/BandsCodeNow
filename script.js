let generatedKeys = new Set();
// Track if user clicked YouTube/Discord links
let ytClicked = false;
let discordClicked = false;

function nextStep(step) {
    for (let i = 1; i <= 7; i++) {
        document.getElementById('step' + i).classList.add('hidden');
    }
    document.getElementById('step' + step).classList.remove('hidden');
    if (step === 2) {
        ytClicked = false;
        document.getElementById('continue2').classList.add('hidden');
    }
    if (step === 3) {
        setTimeout(() => {
            document.getElementById('continue3').classList.remove('hidden');
        }, 5000);
    }
    if (step === 5) {
        setTimeout(() => {
            document.getElementById('continue5').classList.remove('hidden');
        }, 5000);
    }
    if (step === 6) {
        discordClicked = false;
        document.getElementById('continue6').classList.add('hidden');
    }
    if (step === 7) {
        generateKey();
    }
}

// YouTube link click logic
window.addEventListener('DOMContentLoaded', () => {
    const ytLink = document.getElementById('ytLink');
    ytLink.addEventListener('click', function() {
        ytClicked = true;
        document.getElementById('continue2').classList.add('hidden');
        setTimeout(() => {
            if (document.getElementById('step2').classList.contains('hidden')) return;
            document.getElementById('continue2').classList.remove('hidden');
        }, 10000);
    });
    const discordLink = document.getElementById('discordLink');
    discordLink.addEventListener('click', function() {
        discordClicked = true;
        document.getElementById('continue6').classList.add('hidden');
        setTimeout(() => {
            if (document.getElementById('step6').classList.contains('hidden')) return;
            document.getElementById('continue6').classList.remove('hidden');
        }, 10000);
    });
});

// Prevent continue until link clicked
    document.addEventListener('click', function(e) {
        if (document.getElementById('step2') && !document.getElementById('step2').classList.contains('hidden')) {
            document.getElementById('continue2').disabled = !ytClicked;
        }
        if (document.getElementById('step6') && !document.getElementById('step6').classList.contains('hidden')) {
            document.getElementById('continue6').disabled = !discordClicked;
        }
    });

function verifyHuman() {
    if (document.getElementById('humanCheck').checked) {
        nextStep(5);
    } else {
        alert('Please confirm you are human.');
    }
}
function generateKey() {
    let key;
    do {
        key = 'KEY-' + Math.random().toString(36).substr(2, 10).toUpperCase();
    } while (generatedKeys.has(key));
    generatedKeys.add(key);
    document.getElementById('key').textContent = key;
    setTimeout(() => {
        generatedKeys.delete(key);
    }, 5 * 60 * 60 * 1000); // 5 hours
}
