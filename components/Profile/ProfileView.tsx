
import React, { useState, useEffect } from 'react';
import { User, UserRole, EmployeeDocument } from '../../types';
import DocumentManagement from './DocumentManagement';

interface ProfileViewProps {
  user: User;
  isEditingOwn: boolean;
  currentUserRole: UserRole;
  onUpdate: (user: User) => void;
  // Documents state passed from App usually, or handled internally in this mock
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, isEditingOwn, currentUserRole, onUpdate }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'documents'>('info');
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);

  const isAdmin = currentUserRole === UserRole.ADMIN;
  
  useEffect(() => {
    const savedDocs = localStorage.getItem(`odoodo_docs_${user.id}`);
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
  }, [user.id]);

  useEffect(() => {
    localStorage.setItem(`odoodo_docs_${user.id}`, JSON.stringify(documents));
  }, [documents, user.id]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleDocUpload = (doc: EmployeeDocument) => {
    setDocuments([...documents, doc]);
  };

  const handleDocDelete = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const cardClass = "bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm transition-theme";
  const labelClass = "text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider";
  const inputClass = "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-theme";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Management</h2>
          <p className="text-gray-500 dark:text-slate-400">Manage employee credentials and documents.</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'info' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
          >
            Basic Info
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'documents' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
          >
            Documents
          </button>
        </div>
      </header>

      {activeTab === 'info' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-end">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center shadow-sm"
              >
                <i className="fa-solid fa-pen-to-square mr-2 text-sm"></i> Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info Column */}
            <div className="md:col-span-1 space-y-6">
              <div className={`${cardClass} flex flex-col items-center text-center`}>
                <div className="relative group cursor-pointer">
                  <img 
                    src={formData.profilePic} 
                    alt="" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 dark:border-slate-700 shadow-md group-hover:opacity-75 transition-opacity"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40 rounded-full">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{formData.name}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{formData.position}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase">{formData.department}</span>
                  <span className="px-2 py-1 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-300 text-[10px] font-bold rounded uppercase">ID: {formData.employeeId}</span>
                </div>
              </div>

              <div className={`${cardClass} space-y-4`}>
                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">Quick Stats</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Joined</span>
                  <span className="font-semibold text-gray-900 dark:text-slate-200">{formData.joiningDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Role</span>
                  <span className={`font-semibold ${formData.role === UserRole.ADMIN ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>{formData.role}</span>
                </div>
              </div>
            </div>

            {/* Detailed Info Column */}
            <div className="md:col-span-2 space-y-6">
              <div className={cardClass}>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <i className="fa-solid fa-address-card mr-2 text-blue-600 dark:text-blue-400"></i>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Full Name</label>
                    {isEditing && isAdmin ? (
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Email Address</label>
                    {isEditing && isAdmin ? (
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Phone Number</label>
                    {isEditing ? (
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.phone}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Address</label>
                    {isEditing ? (
                      <textarea rows={1} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClass} />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <i className="fa-solid fa-briefcase mr-2 text-blue-600 dark:text-blue-400"></i>
                  Employment & Salary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Position</label>
                    {isEditing && isAdmin ? (
                      <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className={inputClass} />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.position}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Department</label>
                    {isEditing && isAdmin ? (
                      <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className={inputClass}>
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>HR</option>
                        <option>Finance</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-slate-200 font-medium">{formData.department}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Salary Structure (Base)</label>
                    {isEditing && isAdmin ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input type="number" value={formData.salaryBase} onChange={e => setFormData({...formData, salaryBase: Number(e.target.value)})} className={`${inputClass} pl-7`} />
                      </div>
                    ) : (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${formData.salaryBase.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Documents Summary</label>
                    <div className="flex space-x-2">
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {documents.length} files in repository
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <DocumentManagement 
            employee={user} 
            currentUser={user} // In a real app this is the actual logged in user
            documents={documents} 
            onUpload={handleDocUpload} 
            onDelete={handleDocDelete} 
          />
        </div>
      )}
    </div>
  );
};

export default ProfileView;
