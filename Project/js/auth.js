document.addEventListener('DOMContentLoaded', () => {
  // Login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || 'Invalid email or password', 'error');
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Log user role in console
        console.log(`User logged in as role: ${data.user.role}`);

        showToast('Login successful!', 'success');

        setTimeout(() => {
          if (data.user.role && data.user.role.toLowerCase() === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1000);
      } catch (err) {
        showToast('Error logging in. Please try again.', 'error');
        console.error(err);
      }
    });
  }

  // Signup form handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const termsChecked = document.getElementById('terms')?.checked || false;

      if (!firstName || !lastName) {
        showToast('Please enter your name', 'error');
        return;
      }
      if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      if (!termsChecked) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || 'Signup failed', 'error');
          return;
        }

        // Automatically log in the user after signup
        const loginRes = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          showToast(loginData.message || 'Login after signup failed', 'error');
          return;
        }

        localStorage.setItem('token', loginData.token);
        localStorage.setItem('currentUser', JSON.stringify(loginData.user));

        // Log user role in console after signup/login
        console.log(`User logged in as role: ${loginData.user.role}`);

        showToast('Account created and logged in successfully!', 'success');

        setTimeout(() => {
          if (loginData.user.role && loginData.user.role.toLowerCase() === 'admin') {
            window.location.href = 'admin.html';  // Admin dashboard page
          } else {
            window.location.href = 'index.html';  // Normal user homepage
          }
        }, 1000);
      } catch (err) {
        showToast('Error signing up. Please try again.', 'error');
        console.error(err);
      }
    });
  }

  // Email validation helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
});
