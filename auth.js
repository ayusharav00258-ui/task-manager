// Signup
function signup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  if (!username || !password) {
    message.textContent = '❌ Username aur password dono daalo!';
    message.style.color = 'red';
    return;
  }

  if (password.length < 4) {
    message.textContent = '❌ Password kam se kam 4 characters ka hona chahiye';
    message.style.color = 'red';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username]) {
    message.textContent = '❌ Yeh username already exists!';
    message.style.color = 'red';
    return;
  }

  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));
  
  message.textContent = '✅ Account bana! Ab login karo.';
  message.style.color = 'green';
}

// Login
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  if (!username || !password) {
    message.textContent = '❌ Username aur password dono daalo!';
    message.style.color = 'red';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem('currentUser', username);
    message.textContent = '✅ Login successful! Redirecting...';
    message.style.color = 'green';
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } else {
    message.textContent = '❌ Galat username ya password!';
    message.style.color = 'red';
  }
}

// Logout (index.html se call hoga)
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}