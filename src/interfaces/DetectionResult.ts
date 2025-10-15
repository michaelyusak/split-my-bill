export interface PriceDetail {
    currency: string;
    numeric: number;
}

export interface ItemDetailInfo {
    item: string;
    qty?: number;
    price: PriceDetail;
}

export interface ItemDetail {
    category: string;
    info: ItemDetailInfo;
}

export interface ReceiptDetectionResult {
    result_id: string;
    image_url: string;
    result: ItemDetail[];
}