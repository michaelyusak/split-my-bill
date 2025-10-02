import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { HandleGet, HandlePatch } from '../utils/API';
import EditableH2 from '../components/EditableH2';
import type { GetReceiptResponse, Receipt, ReceiptItem } from '../interfaces/Receipt';
import ReceiptParticipantList from '../components/ReceiptParticipantList';
import ExpandableImage from '../components/ExpandableImage';
import EditableDate from '../components/EditableDate';
import { useToast } from '../contexts/ToastContext';

const ReceiptPage = (): React.ReactElement => {
    const {addToast, removeToast} = useToast()

    const [receipt, setReceipt] = useState<Receipt>()
    const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([])

    const { receipt_id } = useParams<{ receipt_id: string }>();

    const fetched = useRef(false);

    const fetchReceipt = () => {
        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/receipt/${receipt_id}`

        HandleGet<GetReceiptResponse>(
            url
        ).then((data) => {
            setReceipt(data.receipt)
            setReceiptItems(data.receipt_items)
        }).catch(() => {
            const toastId = `receipt:failedFetchReceipt:${Date.now()}`
            addToast(toastId, "Something went wrong", false, false, 3 * 1000)
            setTimeout(() => {
                removeToast(toastId)
            }, 3 * 1000)
        })
    }

    const updateReceiptName = (receiptName: string) => {
        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/receipt/${receipt_id}`
        const body = {
            "receipt_name": receiptName
        }

        HandlePatch(
            url,
            JSON.stringify(body)
        ).then(() => {
            const toastId = `receipt:successUpdateReceiptName:${Date.now()}`
            addToast(toastId, "✅ Receipt updated.", true, false, 3 * 1000)
            setTimeout(() => {
                removeToast(toastId)
            }, 3 * 1000)
        })
    }

    const updateReceiptDate = (receiptDate: number) => {
        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/receipt/${receipt_id}`
        const body = {
            "receipt_date": receiptDate
        }

        HandlePatch(
            url,
            JSON.stringify(body)
        ).then(() => {
            const toastId = `receipt:successUpdateReceiptDate:${Date.now()}`
            addToast(toastId, "✅ Receipt updated.", true, false, 3 * 1000)
            setTimeout(() => {
                removeToast(toastId)
            }, 3 * 1000)
        })
    }

    useEffect(() => {
        if (receipt_id === "" || (receipt && receiptItems) || fetched.current) {
            return
        }

        fetchReceipt()
        fetched.current = true
    }, [receipt_id])

    return (
        <>
            {receipt && receiptItems && (
                <div className="flex flex-col items-center w-full px-6 py-8">
                    {/* Header */}

                    <div className='relative flex items-center w-full justify-center mb-6'>
                        <EditableH2
                            content={receipt.receipt_name}
                            onConfirm={(title) => updateReceiptName(title)}
                            customClassName='mx-auto'
                        ></EditableH2>

                        <EditableDate
                            content={receipt.receipt_date}
                            onConfirm={(date: number) => updateReceiptDate(date)}
                            customClassName='absolute right-0'
                            isMaxToday
                            onError={(msg: string) => addToast(`receipt:errorEditingDate:${Date.now()}`, msg, false, false, 3 * 1000)}
                        ></EditableDate>
                    </div>

                    {/* Receipt Image */}
                    <div className="flex justify-between w-full gap-1">
                        <div className='w-[50%] flex flex-col items-center gap-5'>
                            {/* Receipt Image */}
                            <ExpandableImage
                                src={receipt.receipt_image_url}
                                alt='Receipt'
                                onMinimizeClass="w-40 aspect-square rounded-lg shadow-md object-cover"
                                isOpenTab
                            ></ExpandableImage>

                            {/* PARTICIPANT LIST */}
                            <ReceiptParticipantList
                                receiptId={receipt.receipt_id}
                            ></ReceiptParticipantList>
                        </div>

                        {/* Details */}
                        <div className="w-[50%] bg-white shadow rounded-lg p-4 font-mono text-sm">
                            <div className="divide-y">
                                {receiptItems.map((item: ReceiptItem, idx: number) => (
                                    <div
                                        key={`${item.item_category}-${idx}`}
                                        className="flex justify-between py-2"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{item.item_name}</span>
                                            <span className="text-xs text-gray-500">{item.item_category}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-gray-600">
                                                {item.item_quantity ?? "-"}x
                                            </span>
                                            <span className="font-medium text-right">
                                                {item.item_price_currency} {item.item_price_numeric.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ReceiptPage