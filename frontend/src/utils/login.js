export async function login(email, password) {
    try {
      const response = await fetch('http://localhost:8081/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      const data = await response.json();
      return data; // Mengembalikan data respons dari server
    } catch (error) {
      throw new Error(error.message);
    }
  }
  