axios.post('/api/auth/login', { username, password }).then(res => {
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('role', res.data.role);
});
