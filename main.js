//POPUP LOGIC

let popupShown = false;

setTimeout(() => {
  if (!popupShown) showPopup();
}, 8000);


document.addEventListener('mouseleave', (e) => {
  if (e.clientY < 5 && !popupShown) showPopup();
});

function showPopup() {
  popupShown = true;
  document.getElementById('popup-overlay').classList.add('show');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('show');
}

function savePopupEmail() {
  const email = document.getElementById('popup-email').value.trim();

  if (!email || !email.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }

  //localStorage
  const emails = JSON.parse(localStorage.getItem('captured_emails') || '[]');
  emails.push({ email, date: new Date().toISOString() });
  localStorage.setItem('captured_emails', JSON.stringify(emails));

  document.getElementById('popup-success').style.display = 'block';
  setTimeout(closePopup, 1500);
}



function updateProgress(step) {
  for (let i = 1; i <= 3; i++) {
    document.getElementById('pb' + i).classList.toggle('active', i <= step);
  }
  document.getElementById('step-label').textContent = `Step ${step} of 3`;
}

function showStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');
  updateProgress(step);
}

function nextStep(from) {
  if (!validateStep(from)) return; 
  if (from === 2) buildSummary();  
  showStep(from + 1);
}

function prevStep(from) {
  showStep(from - 1);
}

function updateStep3() {
  const cat = document.getElementById('category').value;
  document.getElementById('fields-funded').style.display     = cat === 'funded'     ? 'block' : 'none';
  document.getElementById('fields-invitation').style.display = cat === 'invitation' ? 'block' : 'none';
  document.getElementById('fields-self').style.display       = cat === 'self'       ? 'block' : 'none';
}

function showError(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

function validateStep(step) {
  let valid = true;

  if (step === 1) {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const country = document.getElementById('country').value.trim();

    if (!name)                        { showError('err-name', true);    valid = false; } else showError('err-name', false);
    if (!email || !email.includes('@')) { showError('err-email', true);  valid = false; } else showError('err-email', false);
    if (!country)                     { showError('err-country', true); valid = false; } else showError('err-country', false);
  }

  if (step === 2) {
    const cat = document.getElementById('category').value;
    if (!cat) { showError('err-category', true); valid = false; } else showError('err-category', false);
  }

  return valid;
}

function validateStep3() {
  const cat = document.getElementById('category').value;
  let valid = true;

  if (cat === 'funded') {
    const m = document.getElementById('motivation').value.trim();
    if (!m) { showError('err-motivation', true); valid = false; } else showError('err-motivation', false);
  }

  if (cat === 'invitation') {
    const p  = document.getElementById('passport').value.trim();
    const pu = document.getElementById('purpose').value.trim();
    if (!p)  { showError('err-passport', true); valid = false; } else showError('err-passport', false);
    if (!pu) { showError('err-purpose', true);  valid = false; } else showError('err-purpose', false);
  }

  if (cat === 'self') {
    if (!document.getElementById('budget').checked) {
      showError('err-budget', true); valid = false;
    } else {
      showError('err-budget', false);
    }
  }

  return valid;
}

function buildSummary() {
  const cat = document.getElementById('category').value;
  const labels = { funded: 'Fully Funded', invitation: 'Invitation Letter', self: 'Self-Funded' };

  document.getElementById('summary-content').innerHTML = `
    <br/>Name: <strong>${document.getElementById('name').value}</strong><br/>
    Email: <strong>${document.getElementById('email').value}</strong><br/>
    Country: <strong>${document.getElementById('country').value}</strong><br/>
    Category: <strong>${labels[cat] || cat}</strong>
  `;
  document.getElementById('summary-box').style.display = 'block';
}

function submitForm() {
  if (!validateStep3()) return;

  //Save submission to localStorage (Task 6 Bonus)
  const submission = {
    name:      document.getElementById('name').value,
    email:     document.getElementById('email').value,
    country:   document.getElementById('country').value,
    category:  document.getElementById('category').value,
    timestamp: new Date().toISOString()
  };

  const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
  submissions.push(submission);
  localStorage.setItem('form_submissions', JSON.stringify(submissions));

  document.getElementById('form-container').style.display = 'none';
  document.getElementById('thankyou').style.display = 'block';

  // Show a reference ID
  const ref = Math.random().toString(36).substr(2, 8).toUpperCase();
  document.getElementById('submission-log').textContent =
    `Saved at ${new Date().toLocaleTimeString()} — Ref: ${ref}`;
}