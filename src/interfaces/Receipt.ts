export interface CreateReceiptResponse {
    receipt_id: number
}

export interface Receipt {
    receipt_id: number;
    receipt_name: string;
    receipt_date: number;
    receipt_image_url: string;
    created_at: number;
    updated_at?: number;
}

export interface ReceiptItem {
    receipt_item_id: number;
    receipt_id: number;
    item_category: string;
    item_name: string;
    item_quantity: number;
    item_price_currency: string;
    item_price_numeric: number;
    created_at: number;
    updated_at?: number;
}

export interface GetReceiptResponse {
    receipt: Receipt;
    receipt_items: ReceiptItem[];
}