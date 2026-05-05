import axios from 'axios';

const API_URL = '/api/auth';

// Add axios interceptor for JWT
axios.interceptors.request.use(
  (config) => {
    console.log('Interpreting request to:', config.url);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
        console.log('Attaching token for user:', user.username);
        config.headers.Authorization = `Bearer ${user.token}`;
      } else {
        console.warn('No token found in user object');
      }
    } else {
      console.warn('No user found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
  roles: string[];
  photo?: string;
}

class AuthService {
  login(username: string, password: string): Promise<AuthResponse> {
    return axios
      .post(API_URL + '/login', { username, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  refreshToken() {
    const user = this.getCurrentUser();
    if (!user) return Promise.reject('No user logged in');

    return axios.post(API_URL + '/refresh', {
      refreshToken: user.refreshToken,
    }).then(response => {
      if (response.data.token) {
        const newUser = { ...user, token: response.data.token };
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return response.data;
    });
  }
}

export default new AuthService();
