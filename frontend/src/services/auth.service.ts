import api from './api';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: any;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<any> {
    const response = await api.get('/auth/me');
    return response.data;
  }
}

export default new AuthService();