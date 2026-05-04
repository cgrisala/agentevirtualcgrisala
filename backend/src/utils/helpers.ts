export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = (): string => 
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const extractPhoneNumber = (phone: string): string => 
  phone.replace(/\D/g, '');

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const formatDate = (date: Date): string => 
  date.toISOString().split('T')[0];

export const getDaysDifference = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

export const paginate = (total: number, page: number, pageSize: number) => ({
  page: Math.max(1, page),
  pageSize: Math.max(1, pageSize),
  skip: (Math.max(1, page) - 1) * pageSize,
  totalPages: Math.ceil(total / Math.max(1, pageSize)),
});
