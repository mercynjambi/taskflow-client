import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl border border-dark/10 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-dark mb-6">
          Welcome back
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-dark mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green text-dark font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Log In
        </button>

        <p className="text-sm text-dark/60 mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-green font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;