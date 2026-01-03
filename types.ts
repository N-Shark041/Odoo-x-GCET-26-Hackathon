
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum UserStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  HALF_DAY = 'Half-day',
  LEAVE = 'Leave',
  LATE = 'Late'
}

export enum LeaveType {
  PAID = 'Paid',
  SICK = 'Sick',
  UNPAID = 'Unpaid'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  employeeId: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  phone: string;
  address: string;
  profilePic: string;
  department: string;
  position: string;
  joiningDate: string;
  salaryBase: number;
  bankName?: string;
  accountNumber?: string;
  emergencyContact?: string;
  reportingManager?: string;
  officeLocation?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  checkIn?: string; // ISO DateTime
  checkOut?: string; // ISO DateTime
  status: AttendanceStatus;
  correctionNote?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  remarks: string;
  status: LeaveStatus;
  adminComment?: string;
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Unpaid';
  generatedAt: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByRole: UserRole;
  createdAt: string;
  isPrivate?: boolean; // Visible only to Admins
}

export interface EmployeeFullProfile {
  user: User;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payrolls: PayrollRecord[];
  documents: EmployeeDocument[];
}
