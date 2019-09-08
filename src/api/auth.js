import axios from 'axios'

export async function login({ username, password }) {
  // const response = await axios.post('/api/login', { username, password })
  // Fake login request
  const response = {
    data: {
      username,
      token: 'default_token',
    },
  }
  return response.data
}
