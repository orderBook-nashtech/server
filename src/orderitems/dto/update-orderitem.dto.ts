
export class UpdateOrderitemDto {
  orderId: string;
  bookId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}
