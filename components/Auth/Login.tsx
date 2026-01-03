
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import PasswordInput from './PasswordInput';

interface LoginProps {
  onLogin: (data: { token: string, user: User }) => void;
  onGoToSignUp: () => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onLogin(result.data);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 transition-all">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0078d4] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-check text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">OdooDo</h2>
          <p className="text-gray-500 mt-2 font-medium">Provisioning your corporate workday.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Corporate Email</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@odoodo.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <PasswordInput 
            value={password}
            onChange={setPassword}
            showChecklist={false}
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0078d4] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/10 hover:bg-[#106ebe] active:scale-[0.98] transition-all"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Demo Environment</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => {setEmail('admin@odoodo.com'); setPassword('password');}} className="text-xs font-bold text-[#0078d4] hover:underline">Admin</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => {setEmail('employee@odoodo.com'); setPassword('password');}} className="text-xs font-bold text-[#0078d4] hover:underline">Staff</button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Need an account? <button onClick={onGoToSignUp} className="text-[#0078d4] font-bold hover:underline">Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
