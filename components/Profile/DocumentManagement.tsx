
import React, { useState } from 'react';
import { User, UserRole, EmployeeDocument } from '../../types';
import DocumentPreviewModal from './DocumentPreviewModal';

interface DocumentManagementProps {
  employee: User;
  currentUser: User;
  documents: EmployeeDocument[];
  onUpload: (doc: EmployeeDocument) => void;
  onDelete: (id: string) => void;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ 
  employee, 
  currentUser, 
  documents, 
  onUpload, 
  onDelete 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<EmployeeDocument | null>(null);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [error, setError] = useState('');

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, and PNG files are allowed.');
      return;
    }

    if (!newDocTitle.trim()) {
      setError('Please provide a title for the document.');
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Convert file to Base64 for demo storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        const newDoc: EmployeeDocument = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: employee.id,
          title: newDocTitle,
          fileUrl: reader.result as string,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          uploadedBy: currentUser.id,
          uploadedByRole: currentUser.role,
          createdAt: new Date().toISOString()
        };
        onUpload(newDoc);
        setIsUploading(false);
        setNewDocTitle('');
        setUploadProgress(0);
        if (e.target) e.target.value = '';
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const canDelete = (doc: EmployeeDocument) => {
    if (isAdmin) return true;
    
    // Protect HR-uploaded contracts
    const protectedKeywords = ['contract', 'offer letter', 'agreement'];
    const isProtected = protectedKeywords.some(key => doc.title.toLowerCase().includes(key));
    const uploadedByAdmin = doc.uploadedByRole === UserRole.ADMIN;
    
    if (isProtected && uploadedByAdmin) return false;
    
    return doc.employeeId === currentUser.id;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden transition-theme">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
            <i className="fa-solid fa-folder-tree mr-2 text-blue-600 dark:text-blue-400"></i>
            Document Repository
          </h4>
        </div>

        {/* Upload Zone */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Document Title</label>
              <input 
                type="text" 
                placeholder="e.g. Passport Copy"
                value={newDocTitle}
                onChange={e => setNewDocTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:text-white text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-gray-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors mb-2"></i>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
              </label>
            </div>
          </div>

          {error && <p className="mt-3 text-xs text-red-500 font-bold flex items-center"><i className="fa-solid fa-circle-exclamation mr-1"></i> {error}</p>}

          {isUploading && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Uploading {newDocTitle}...</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Document Table */}
        <div className="overflow-x-auto border-t border-gray-100 dark:border-slate-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Uploaded</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500 italic text-sm font-medium">
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.slice().reverse().map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.fileType.includes('pdf') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                          <i className={`fa-solid ${doc.fileType.includes('pdf') ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">{doc.fileType.split('/')[1]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-900 dark:text-slate-200 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">by {doc.uploadedByRole === UserRole.ADMIN ? 'HR' : 'Self'}</p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="View Document"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(doc.id)}
                        disabled={!canDelete(doc)}
                        className={`p-2 rounded-lg transition-all ${canDelete(doc) ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30' : 'text-gray-200 dark:text-slate-700 cursor-not-allowed'}`}
                        title={canDelete(doc) ? "Delete Document" : "Protected Document"}
                      >
                        <i className={`fa-solid ${canDelete(doc) ? 'fa-trash-can' : 'fa-lock'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoc && (
        <DocumentPreviewModal 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </div>
  );
};

export default DocumentManagement;
