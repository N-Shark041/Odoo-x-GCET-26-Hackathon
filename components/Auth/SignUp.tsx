
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import PasswordInput from './PasswordInput';
import { isPasswordValid, checkCommonPassword } from '../../utils/passwordUtils';
import { generateCorporateEmail, isValidCorporateEmail } from '../../utils/emailUtils';

interface SignUpProps {
  onSignUp: (user: User) => void;
  onGoToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.EMPLOYEE,
    name: '',
  });
  const [error, setError] = useState('');

  // Auto-generate email based on Name and Employee ID
  useEffect(() => {
    const generatedEmail = generateCorporateEmail(formData.name, formData.employeeId);
    setFormData(prev => ({ ...prev, email: generatedEmail }));
  }, [formData.name, formData.employeeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidCorporateEmail(formData.email)) {
      setError('Invalid email format. Use your full name and employee ID.');
      return;
    }

    if (!isPasswordValid(formData.password)) {
      setError('Password does not meet the security requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (checkCommonPassword(formData.password)) {
      setError('Password is too common or weak. Please increase complexity.');
      return;
    }

    // Added status: UserStatus.ACTIVE to satisfy the User interface
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: formData.employeeId,
      email: formData.email,
      role: formData.role,
      status: UserStatus.ACTIVE,
      name: formData.name,
      phone: '',
      address: '',
      profilePic: `https://picsum.photos/seed/${formData.employeeId}/200`,
      department: 'General',
      position: 'Employee',
      joiningDate: new Date().toISOString().split('T')[0],
      salaryBase: 3500
    };
    onSignUp(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 transition-theme">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
           <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Provision your Dayflow corporate identity</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center animate-in fade-in zoom-in duration-300">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1">Employee ID</label>
            <input 
              type="text" 
              placeholder="e.g. DEV01"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
              value={formData.employeeId}
              onChange={e => setFormData({...formData, employeeId: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1">Role Type</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
            >
              <option value={UserRole.EMPLOYEE}>Employee</option>
              <option value={UserRole.ADMIN}>Admin / HR</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
              Corporate Email 
              <span className="flex items-center text-[10px] text-blue-500 lowercase normal-case">
                <i className="fa-solid fa-lock mr-1"></i> Auto-generated
              </span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope-shield absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                readOnly
                placeholder="name.id@odoodo.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-500 dark:text-slate-500 cursor-not-allowed font-medium"
                value={formData.email}
              />
            </div>
            <p className="text-[10px] text-gray-400 pl-1 font-medium">
              Your official login is based on your name and ID. Personal emails are not permitted.
            </p>
          </div>

          <div className="md:col-span-2">
            <PasswordInput 
              value={formData.password}
              onChange={val => setFormData({...formData, password: val})}
            />
          </div>

          <div className="md:col-span-2">
            <PasswordInput 
              label="Confirm Password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={val => setFormData({...formData, confirmPassword: val})}
              showChecklist={false}
            />
          </div>

          <button 
            type="submit"
            className="w-full md:col-span-2 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all mt-4 hover:scale-[1.01] active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-slate-800 pt-6">
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Already have an account? <button onClick={onGoToLogin} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In Instead</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
