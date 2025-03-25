const generateBtn = document.getElementById('generate');
  const passwordField = document.getElementById('password');
  const copyBtn = document.getElementById('copy');
  const lengthInput = document.getElementById('length');
  const lengthValue = document.getElementById('length-value');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const numbersCheckbox = document.getElementById('numbers');
  const specialCharsCheckbox = document.getElementById('special-chars');
  const strengthText = document.getElementById('strength');
  const bar = document.getElementById('bar');
  const historyContainer = document.getElementById('history');
  const themeToggle = document.getElementById('theme');
  const btnContent = document.querySelector('.btn-content');
  const btnLoader = document.querySelector('.btn-loader');
  
  // Character sets
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-={}[]|:;"<>,.?/~`';
  
  // Theme setup
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.checked = currentTheme === 'dark';
  
  // Update length display
  lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
  });
  
  // Generate password
  generateBtn.addEventListener('click', generatePassword);
  
  // Copy password
  copyBtn.addEventListener('click', copyToClipboard);
  
  // Theme toggle
  themeToggle.addEventListener('change', toggleTheme);
  
  // Generate password function
  function generatePassword() {
    // Show loading state
    generateBtn.classList.add('loading');
    
    // Get selected character sets
    let charSet = lowercaseLetters;
    if (uppercaseCheckbox.checked) charSet += uppercaseLetters;
    if (numbersCheckbox.checked) charSet += numbers;
    if (specialCharsCheckbox.checked) charSet += specialChars;
    
    // Generate after short delay for animation
    setTimeout(() => {
      let password = '';
      const length = parseInt(lengthInput.value);
      
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
      }
      
      passwordField.value = password;
      updateStrengthMeter(password);
      generateBtn.classList.remove('loading');
      
      // Add slight animation to password field
      passwordField.classList.add('pulse');
      setTimeout(() => passwordField.classList.remove('pulse'), 300);
    }, 800);
  }
  
  // Update password strength meter
  function updateStrengthMeter(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    
    // Character diversity checks
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update UI
    let strengthLevel = '';
    let strengthClass = '';
    
    if (strength <= 2) {
      strengthLevel = 'Weak';
      strengthClass = 'strength-weak';
      bar.className = 'bar bar-weak';
      
      // Shake animation for weak passwords
      passwordField.classList.add('shake');
      setTimeout(() => passwordField.classList.remove('shake'), 500);
    } 
    else if (strength <= 4) {
      strengthLevel = 'Medium';
      strengthClass = 'strength-medium';
      bar.className = 'bar bar-medium';
    } 
    else {
      strengthLevel = 'Strong';
      strengthClass = 'strength-strong';
      bar.className = 'bar bar-strong';
    }
    
    strengthText.textContent = strengthLevel;
    strengthText.className = strengthClass;
    bar.style.width = `${(strength / 6) * 100}%`;
  }
  
  // Copy to clipboard
  function copyToClipboard() {
    if (!passwordField.value) return;
    
    passwordField.select();
    document.execCommand('copy');
    
    // Visual feedback
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.color = '#00b894';
    
    // Add to history
    addToHistory(passwordField.value);
    
    // Reset after delay
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="far fa-copy"></i>';
      copyBtn.style.color = '';
    }, 2000);
  }
  
  // Add password to history
  function addToHistory(password) {
    if (!password) return;
    
    // Create history item
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const passwordText = document.createElement('span');
    passwordText.textContent = password;
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="far fa-copy"></i>';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(password);
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
      }, 2000);
    });
    
    historyItem.appendChild(passwordText);
    historyItem.appendChild(copyBtn);
    
    // Add to beginning of history
    historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    
    // Limit history to 10 items
    if (historyContainer.children.length > 10) {
      historyContainer.removeChild(historyContainer.lastChild);
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  // Generate initial password
  generatePassword();
});
