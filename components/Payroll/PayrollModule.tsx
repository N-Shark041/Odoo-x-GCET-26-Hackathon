
import React, { useState } from 'react';
import { User, UserRole, PayrollRecord } from '../../types';

interface PayrollModuleProps {
  currentUser: User;
  users: User[];
  payrolls: PayrollRecord[];
  onUpdatePayroll: (p: PayrollRecord) => void;
  onAddPayroll: (p: PayrollRecord) => void;
}

const PayrollModule: React.FC<PayrollModuleProps> = ({ currentUser, users, payrolls, onUpdatePayroll, onAddPayroll }) => {
  const [showProcessor, setShowProcessor] = useState(false);
  const isAdmin = currentUser.role === UserRole.ADMIN;
  
  const relevantPayrolls = isAdmin 
    ? payrolls 
    : payrolls.filter(p => p.userId === currentUser.id);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleProcessPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const userId = formData.get('userId') as string;
    const user = users.find(u => u.id === userId);
    
    if (!user) return;

    const base = user.salaryBase;
    const bonus = Number(formData.get('bonus') || 0);
    const deductions = Number(formData.get('deductions') || 0);

    // Added generatedAt property to meet PayrollRecord interface requirements
    const newPayroll: PayrollRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      month: formData.get('month') as string,
      year: 2024,
      baseSalary: base,
      bonus,
      deductions,
      netPay: base + bonus - deductions,
      status: 'Paid',
      generatedAt: new Date().toISOString()
    };

    onAddPayroll(newPayroll);
    setShowProcessor(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll System</h2>
          <p className="text-gray-500 dark:text-slate-400">View salary structures and monthly payouts.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowProcessor(!showProcessor)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            {showProcessor ? 'Close Processor' : 'Run Payroll Run'}
          </button>
        )}
      </header>

      {showProcessor && isAdmin && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl animate-in fade-in duration-300 transition-theme">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
             <i className="fa-solid fa-microchip mr-2 text-emerald-600 dark:text-emerald-400"></i>
             Manual Payroll Processor
           </h3>
           <form onSubmit={handleProcessPayroll} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Employee</label>
                <select name="userId" className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white" required>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} (${u.salaryBase})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Month</label>
                <select name="month" className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white" required>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Bonus ($)</label>
                <input type="number" name="bonus" className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Deductions ($)</label>
                <input type="number" name="deductions" className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white" defaultValue={0} />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md">
                  Generate & Pay Payslip
                </button>
              </div>
           </form>
        </div>
      )}

      {/* Pay history Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden transition-theme">
        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4">Ref ID</th>
                {isAdmin && <th className="px-6 py-4">Employee</th>}
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Base Salary</th>
                <th className="px-6 py-4">Bonus</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Net Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {relevantPayrolls.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500 italic font-medium">
                    No payroll records found.
                  </td>
                </tr>
              )}
              {relevantPayrolls.slice().reverse().map(record => {
                const emp = users.find(u => u.id === record.userId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">#{record.id}</td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <img src={emp?.profilePic} className="w-6 h-6 rounded-full" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">{emp?.name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-200">{record.month} {record.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">${record.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">+${record.bonus.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400 font-semibold">-${record.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">${record.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                        record.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollModule;
