const applianceMeta = {
  ac: {
    label: 'AC',
    image: 'assets/ac.svg',
    services: [
      { name: 'AC Inspection', price: 499 },
      { name: 'AC Deep Cleaning', price: 999 },
      { name: 'AC Gas Refill', price: 2499 },
      { name: 'AC Installation / Uninstallation', price: 1499 },
      { name: 'AC Repair Visit', price: 699 }
    ]
  },
  'washing-machine': {
    label: 'Washing Machine',
    image: 'assets/washing-machine.svg',
    services: [
      { name: 'General Service', price: 599 },
      { name: 'Deep Drum Cleaning', price: 899 },
      { name: 'Motor/Drain Repair Visit', price: 749 },
      { name: 'Installation / Uninstallation', price: 699 },
      { name: 'Water Leakage Repair', price: 799 }
    ]
  },
  refrigerator: {
    label: 'Refrigerator',
    image: 'assets/refrigerator.svg',
    services: [
      { name: 'General Checkup', price: 499 },
      { name: 'Cooling Repair Visit', price: 799 },
      { name: 'Gas Charging', price: 1999 },
      { name: 'Door Seal Replacement Visit', price: 649 },
      { name: 'Deep Cleaning + Sanitization', price: 899 }
    ]
  }
};

const aiTips = {
  ac: 'Detected AC issue. Try AC Deep Cleaning first. If cooling is still low, choose Gas Refill or Repair Visit.',
  'washing-machine': 'Detected Washing Machine issue. For noise/drain issues, book Motor/Drain Repair. For odor, choose Deep Drum Cleaning.',
  refrigerator: 'Detected Refrigerator issue. For low cooling, start with Cooling Repair Visit. Gas Charging may be advised after inspection.'
};

function navigateAfterAuth(provider) {
  localStorage.setItem('auth_provider', provider);
  window.location.href = 'app.html';
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  navigateAfterAuth('email+jwt');
});

document.getElementById('signup-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  navigateAfterAuth('email+jwt');
});

document.getElementById('google-login')?.addEventListener('click', () => navigateAfterAuth('google-oauth'));
document.getElementById('google-signup')?.addEventListener('click', () => navigateAfterAuth('google-oauth'));

document.querySelectorAll('.appliance-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const appliance = btn.dataset.appliance;
    window.location.href = `service.html?appliance=${appliance}`;
  });
});

function detectAppliance(text) {
  const lower = text.toLowerCase();
  if (lower.includes('ac') || lower.includes('air')) return 'ac';
  if (lower.includes('wash') || lower.includes('machine')) return 'washing-machine';
  if (lower.includes('fridge') || lower.includes('refrigerator')) return 'refrigerator';
  return 'ac';
}

function attachVoiceInput(buttonId, inputElementId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputElementId);
  if (!button || !input) return;

  button.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice control is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
    };
  });
}

attachVoiceInput('voice-issue', 'issue-input');
attachVoiceInput('voice-booking', 'booking-issue');

const aiButton = document.getElementById('get-advice');
aiButton?.addEventListener('click', () => {
  const issue = document.getElementById('issue-input').value.trim();
  const responseBox = document.getElementById('ai-response');

  if (!issue) {
    responseBox.textContent = 'Please enter or speak your issue first.';
    return;
  }

  const appliance = detectAppliance(issue);
  responseBox.textContent = `AI Suggestion (${applianceMeta[appliance].label}): ${aiTips[appliance]} Voice stack: Whisper STT + GPT-4o-mini intent parsing.`;
});

const params = new URLSearchParams(window.location.search);
const selectedAppliance = params.get('appliance');

if (selectedAppliance && applianceMeta[selectedAppliance]) {
  const serviceTitle = document.getElementById('service-title');
  const applianceName = document.getElementById('appliance-name');
  const applianceImage = document.getElementById('appliance-image');
  const pricingList = document.getElementById('pricing-list');

  if (serviceTitle) {
    serviceTitle.textContent = `${applianceMeta[selectedAppliance].label} Service Booking`;
  }
  if (applianceName) {
    applianceName.textContent = `${applianceMeta[selectedAppliance].label} Services (INR ₹)`;
  }
  if (applianceImage) {
    applianceImage.src = applianceMeta[selectedAppliance].image;
    applianceImage.alt = `${applianceMeta[selectedAppliance].label} logo`;
  }

  if (pricingList) {
    pricingList.innerHTML = applianceMeta[selectedAppliance].services
      .map((item) => `<li>${item.name} — ₹${item.price}</li>`)
      .join('');
  }
}

document.getElementById('booking-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('booking-message');
  message.textContent = 'Booking confirmed! Razorpay link + technician details will be shared shortly.';
});
