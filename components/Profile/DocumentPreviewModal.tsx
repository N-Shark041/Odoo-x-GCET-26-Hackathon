
import React from 'react';
import { EmployeeDocument } from '../../types';

interface DocumentPreviewModalProps {
  document: EmployeeDocument;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{document.title}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">{document.fileName} • {(document.fileSize / 1024).toFixed(1)} KB</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-gray-500"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </header>

        <div className="flex-1 bg-gray-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
          {document.fileType.includes('pdf') ? (
            <iframe 
              src={document.fileUrl} 
              className="w-full h-full border-none"
              title={document.title}
            />
          ) : (
            <img 
              src={document.fileUrl} 
              alt={document.title} 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          )}
        </div>

        <footer className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end bg-gray-50/50 dark:bg-slate-900">
          <a 
            href={document.fileUrl} 
            download={document.fileName}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-md shadow-blue-500/20"
          >
            <i className="fa-solid fa-download mr-2"></i> Download
          </a>
        </footer>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
