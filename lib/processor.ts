import { isValid, parseISO } from 'date-fns';

export interface ValidationRule {
  id: number;
  field: string;
  rule: string;
  enabled: boolean;
  type: string;
}

export interface ValidationError {
  row: number;
  field: string;
  detected: string;
  fix: string;
}

export interface ProcessedFile {
  id: string;
  name: string;
  processedAt: Date;
  totalRecords: number;
  validRecordsCount: number;
  qualityScore: number;
  validData: any[];
  errorData: any[];
  errors: ValidationError[];
  errorStats: Record<string, number>;
  countryStats: Record<string, number>;
}

export const defaultRules: ValidationRule[] = [
  { id: 1, field: 'phone', rule: 'Valid format for country', enabled: true, type: 'format' },
  { id: 2, field: 'email', rule: 'Valid email format', enabled: true, type: 'format' },
  { id: 3, field: 'payment_mode', rule: 'One of: Credit Card, Debit Card, UPI, Bank Transfer, Wallet, Cash', enabled: true, type: 'enum' },
  { id: 4, field: 'order_date', rule: 'Valid date (YYYY-MM-DD)', enabled: true, type: 'date' },
  { id: 5, field: 'order_amount', rule: 'Numeric, positive value', enabled: true, type: 'numeric' },
  { id: 6, field: 'order_id', rule: 'Unique identifier', enabled: true, type: 'unique' },
  { id: 7, field: 'customer_id', rule: 'Not empty, valid reference', enabled: true, type: 'required' },
  { id: 8, field: 'country', rule: 'Valid ISO 3166-1 alpha-2 or known country', enabled: true, type: 'enum' },
];

export interface ProcessGlobalContext {
  orderIds: Set<string>;
}

export function processDataset(data: any[], rules: ValidationRule[], filename: string, globalContext?: ProcessGlobalContext): ProcessedFile {
  const validData: any[] = [];
  const errorData: any[] = [];
  const errors: ValidationError[] = [];
  
  const errorStats: Record<string, number> = {
    'Missing Value': 0,
    'Duplicate Order ID': 0,
    'Invalid Payment Mode': 0,
    'Invalid Country': 0,
    'Invalid Date': 0,
    'Invalid Phone': 0,
    'Invalid Amount': 0,
  };
  
  const countryStats: Record<string, number> = {};
  const orderIds = globalContext?.orderIds || new Set<string>();

  data.forEach((row, index) => {
    const rowNum = index + 1; // 1-indexed for users
    let isValidRow = true;
    const rowErrors: ValidationError[] = [];

    // Rule: customer_id
    const customerIdRule = rules.find(r => r.field === 'customer_id');
    if (customerIdRule?.enabled) {
      if (row.customer_id === null || row.customer_id === undefined || String(row.customer_id).trim() === '') {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'customer_id', detected: 'Missing', fix: 'Provide a valid customer ID' });
        errorStats['Missing Value']++;
      }
    }

    // Rule: order_id uniqueness
    const orderIdRule = rules.find(r => r.field === 'order_id');
    if (orderIdRule?.enabled) {
      if (!row.order_id) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'order_id', detected: 'Missing', fix: 'Provide a unique ID' });
        errorStats['Missing Value']++;
      } else if (orderIds.has(row.order_id)) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'order_id', detected: String(row.order_id), fix: 'Duplicate Order ID' });
        errorStats['Duplicate Order ID']++;
      } else {
        orderIds.add(row.order_id);
      }
    }

    // Rule: order_date
    const dateRule = rules.find(r => r.field === 'order_date');
    if (dateRule?.enabled) {
      if (!row.order_date) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'order_date', detected: 'Missing', fix: 'Provide date' });
        errorStats['Missing Value']++;
      } else {
        const parsed = parseISO(row.order_date);
        if (!isValid(parsed)) {
          isValidRow = false;
          rowErrors.push({ row: rowNum, field: 'order_date', detected: String(row.order_date), fix: 'Use YYYY-MM-DD' });
          errorStats['Invalid Date']++;
        }
      }
    }

    // Rule: order_amount
    const amountRule = rules.find(r => r.field === 'order_amount');
    if (amountRule?.enabled) {
      if (!row.order_amount) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'order_amount', detected: 'Missing', fix: 'Provide amount' });
        errorStats['Missing Value']++;
      } else {
        const amount = parseFloat(row.order_amount);
        if (isNaN(amount) || amount <= 0) {
          isValidRow = false;
          rowErrors.push({ row: rowNum, field: 'order_amount', detected: String(row.order_amount), fix: 'Must be positive numeric' });
          errorStats['Invalid Amount']++;
        }
      }
    }

    // Rule: payment_mode
    const paymentModeRule = rules.find(r => r.field === 'payment_mode');
    const validModes = ['Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Wallet', 'Cash'];
    if (paymentModeRule?.enabled && row.payment_mode) {
      if (!validModes.includes(row.payment_mode)) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'payment_mode', detected: String(row.payment_mode), fix: `Use: ${validModes.join(', ')}` });
        errorStats['Invalid Payment Mode']++;
      }
    }

    // Rule: country
    const countryRule = rules.find(r => r.field === 'country');
    const validCountries = ['USA', 'India', 'Singapore', 'UAE', 'UK', 'Australia', 'Canada'];
    if (countryRule?.enabled) {
      if (!row.country) {
         isValidRow = false;
         rowErrors.push({ row: rowNum, field: 'country', detected: 'Missing', fix: 'Provide country' });
         errorStats['Missing Value']++;
      } else if (!validCountries.includes(row.country)) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'country', detected: String(row.country), fix: 'Add to country rules or correct spelling' });
        errorStats['Invalid Country']++;
      } else {
        countryStats[row.country] = (countryStats[row.country] || 0) + 1;
      }
    } else if (row.country) {
      // Still count stats even if validation is disabled
      countryStats[row.country] = (countryStats[row.country] || 0) + 1;
    }

    // Rule: phone
    const phoneRule = rules.find(r => r.field === 'phone');
    if (phoneRule?.enabled && row.phone) {
      const phoneStr = String(row.phone).replace(/\D/g, '');
      if (phoneStr.length < 8 || phoneStr.length > 15) {
        isValidRow = false;
        rowErrors.push({ row: rowNum, field: 'phone', detected: String(row.phone), fix: 'Provide valid phone number' });
        errorStats['Invalid Phone']++;
      }
    }

    if (isValidRow) {
      validData.push(row);
    } else {
      errorData.push({ ...row, _errors: rowErrors.map(e => `${e.field}: ${e.fix}`).join(' | ') });
      errors.push(...rowErrors);
    }
  });

  const totalRecords = data.length;
  const validRecordsCount = validData.length;
  const qualityScore = totalRecords === 0 ? 0 : Number(((validRecordsCount / totalRecords) * 100).toFixed(1));

  return {
    id: Math.random().toString(36).substring(2, 9),
    name: filename,
    processedAt: new Date(),
    totalRecords,
    validRecordsCount,
    qualityScore,
    validData,
    errorData,
    errors,
    errorStats,
    countryStats,
  };
}

export function generateDemoData(count: number = 25000): any[] {
  const countries = ['USA', 'India', 'Singapore', 'UAE', 'UK'];
  const paymentModes = ['Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Wallet', 'Cash'];
  
  const data: any[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Intentional errors (~10%)
    const hasError = Math.random() < 0.1;
    const errorType = hasError ? Math.floor(Math.random() * 5) : -1;
    
    data.push({
      order_id: errorType === 0 ? `ORD-100${Math.max(1, i-5)}` : `ORD-100${i}`, // Duplicate order ID
      customer_id: `CUST-${Math.floor(Math.random() * 1000)}`,
      order_date: errorType === 1 ? '2026/06/19' : new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0], // Invalid date
      order_amount: errorType === 2 ? 'free' : (Math.random() * 1000).toFixed(2), // Invalid amount
      country: errorType === 3 ? 'Wakanda' : countries[Math.floor(Math.random() * countries.length)], // Invalid country
      phone: errorType === 4 ? '123' : `${Math.floor(1000000000 + Math.random() * 9000000000)}`, // Invalid phone
      payment_mode: hasError && errorType === -1 ? 'PayTM' : paymentModes[Math.floor(Math.random() * paymentModes.length)], // Invalid payment mode sometimes
    });
  }
  
  return data;
}
