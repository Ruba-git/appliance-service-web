const servicePricing = {
  ac: [
    { name: 'AC Inspection', price: 499 },
    { name: 'AC Deep Cleaning', price: 999 },
    { name: 'AC Gas Refill', price: 2499 },
    { name: 'AC Repair Visit', price: 699 }
  ],
  'washing-machine': [
    { name: 'General Service', price: 599 },
    { name: 'Deep Drum Cleaning', price: 899 },
    { name: 'Motor/Drain Repair Visit', price: 749 },
    { name: 'Installation/Uninstallation', price: 699 }
  ],
  refrigerator: [
    { name: 'General Checkup', price: 499 },
    { name: 'Cooling Repair Visit', price: 799 },
    { name: 'Gas Charging', price: 1999 },
    { name: 'Door Seal Replacement Visit', price: 649 }
  ]
};

const aiTips = {
  ac: 'For AC cooling/noise issues, start with Deep Cleaning. If cooling remains low, choose Gas Refill or Repair Visit.',
  'washing-machine': 'If water is not draining or machine is noisy, book Motor/Drain Repair Visit. For odor and hygiene, choose Deep Drum Cleaning.',
  refrigerator: 'For poor cooling, first book Cooling Repair Visit. If gas is low, technician may suggest Gas Charging.'
};

function navigateAfterAuth() {
  window.location.href = 'app.html';
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  navigateAfterAuth();
});

document.getElementById('signup-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  navigateAfterAuth();
});

document.getElementById('google-login')?.addEventListener('click', navigateAfterAuth);
document.getElementById('google-signup')?.addEventListener('click', navigateAfterAuth);

document.querySelectorAll('.appliance-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const appliance = btn.dataset.appliance;
    window.location.href = `service.html?appliance=${appliance}`;
  });
});

function detectAppliance(text) {
  const lower = text.toLowerCase();
  if (lower.includes('ac') || lower.includes('air')) return 'ac';
  if (lower.includes('wash')) return 'washing-machine';
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
  responseBox.textContent = `AI Suggestion: ${aiTips[appliance]} Tap the ${appliance.replace('-', ' ')} card to continue booking.`;
});

const params = new URLSearchParams(window.location.search);
const selectedAppliance = params.get('appliance');

if (selectedAppliance && servicePricing[selectedAppliance]) {
  const serviceTitle = document.getElementById('service-title');
  const pricingList = document.getElementById('pricing-list');

  if (serviceTitle) {
    serviceTitle.textContent = `${selectedAppliance.replace('-', ' ').toUpperCase()} Service Booking`;
  }

  if (pricingList) {
    pricingList.innerHTML = servicePricing[selectedAppliance]
      .map((item) => `<li>${item.name} — ₹${item.price}</li>`)
      .join('');
  }
}

document.getElementById('booking-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('booking-message');
  message.textContent = 'Booking confirmed! Technician will contact you shortly.';
});
