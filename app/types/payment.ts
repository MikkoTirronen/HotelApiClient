export interface PaymentDto {
  paymentId: number;
  invoiceId: number;
  amountPaid: number;
  paymentDate: string;      // ISO string from backend
  paymentMethod: string | null;
  customerName: string;
}