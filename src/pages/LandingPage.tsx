import React, { useRef, useState, type ChangeEvent } from 'react'
import { HandlePost } from '../utils/API';
import type { ReceiptDetectionResult } from '../interfaces/DetectionResult';
import { useNavigate } from 'react-router-dom';
import type { CreateReceiptResponse } from '../interfaces/Receipt';
import { useToast } from '../contexts/ToastContext';

const LandingPage = (): React.ReactElement => {
    const navigate = useNavigate()

    const { addToast, removeToast } = useToast()

    const [fileValue, setFileValue] = useState<File>();
    const [preview, setPreview] = useState<string>();
    const [confirmed, setConfirmed] = useState(false);

    const attachmentFile = useRef<HTMLInputElement>(null);

    function handleAttachmentFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];

        const fileName = file.name;
        const fileSize = file.size;

        let errorMsg = "";

        const fileFormat = fileName.split(".").pop();

        if (!fileFormat) {
            handleCancel()
            return;
        }

        if (fileFormat && !["png", "jpg", "jpeg"].includes(fileFormat)) {
            const toastId = `landing:${Date.now()}`
            errorMsg = `File must be in either png, jpg, or jpeg format`;
            addToast(toastId, errorMsg, false, false, 3 * 1000)
            handleCancel()
            return
        }

        if (fileSize > 2000000) {
            const toastId = `landing:${Date.now()}`
            errorMsg = `File must not be greater than 2Mb`;
            addToast(toastId, errorMsg, false, false, 3 * 1000)
            handleCancel()
            return
        }

        setFileValue(file);
        setPreview(URL.createObjectURL(file))
    }

    const handleConfirm = () => {
        if (!fileValue) {
            const toastId = `landing:${Date.now()}`
            addToast(toastId, "Receipt image is missing", false, false, 3 * 1000)
            return
        }

        setConfirmed(true);

        const detectReceiptUrl = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + "/receipt/detect"
        const detectReceiptBody = new FormData();

        detectReceiptBody.append("file", fileValue)

        const toastIdLoadingDetectReceipt = `landing:loadingDetectReceipt:${Date.now()}`
        addToast(toastIdLoadingDetectReceipt, "⏳ Detecting Receipt...", undefined, false)

        HandlePost<ReceiptDetectionResult>(
            detectReceiptUrl,
            detectReceiptBody
        ).then((data) => {
            removeToast(toastIdLoadingDetectReceipt)
            addToast(`landing:successDetectReceipt:${Date.now()}`, "✅ Receipt detected successfully!", true, false, 3 * 1000)

            const createReceiptlUrl = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + "/receipt"
            const createReceiptlBody = {
                "receipt": {
                    "receipt_name": "My Receipt",
                    "result_id": data.result_id
                },
                "detection_result": data.result
            }

            const toastIdLoadingCreateReceipt = `landing:loadingCreateReceipt:${Date.now()}`
            addToast(toastIdLoadingCreateReceipt, "⏳ Creating your Receipt...", undefined, false)

            HandlePost<CreateReceiptResponse>(
                createReceiptlUrl,
                JSON.stringify(createReceiptlBody),
            ).then((data) => {
                removeToast(toastIdLoadingCreateReceipt)
                addToast(`landing:successCreateReceipt:${Date.now()}`, "✅ Finished extracting your receipt.", true, false, 3 * 1000)

                navigate("/receipt/" + data.receipt_id)
            }).catch(() => {
                addToast(`landing:${Date.now()}`, "❌ Couldn’t save your receipt. Please try again.", false, false, 3 * 1000)
            })
        }).catch(() => {
            handleCancel()
            removeToast(toastIdLoadingDetectReceipt)
            addToast(`landing:${Date.now()}`, "❌ Receipt detection failed. Make sure the photo is clear and try again.", false, false, 3 * 1000)
        })
    };

    function handleCancel() {
        if (attachmentFile.current) {
            attachmentFile.current;
            attachmentFile.current.value = "";
            attachmentFile.current.type = "text";
            attachmentFile.current.type = "file";
        }

        setFileValue(undefined);
        setPreview(undefined);
        setConfirmed(false);
    }

    return (
        <>
            {/* <main className="flex flex-col items-center justify-center flex-1 text-center px-6"> */}
            <main className="relative flex flex-col flex-1 text-center p-6">
                {/* <h2 className="text-4xl font-bold mb-4">Split bills the easy way</h2> */}
                <h2 className="text-4xl font-bold mb-4 self-start md:self-center">
                    Split bills the easy way
                </h2>

                <div className="flex flex-1 flex-col items-center justify-center">
                    {preview && !confirmed ? (
                        <>
                            <div className="flex flex-col items-center gap-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-60 rounded-lg shadow"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleConfirm}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-lg text-gray-600 mb-10 max-w-xl">
                                Upload a bill or add items manually — we’ll do the math for you.
                            </p>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
                                {/* Upload Bill */}
                                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
                                    <div className="text-5xl mb-3">📸</div>
                                    <h3 className="text-xl font-semibold mb-2">Upload a Bill</h3>
                                    <p className="text-gray-600 mb-4">
                                        Snap or upload your receipt. We’ll extract items automatically.
                                    </p>

                                    {/* Input File */}
                                    <label
                                        htmlFor="bill-upload"
                                        className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 cursor-pointer"
                                    >
                                        Upload Bill
                                    </label>
                                    <input
                                        id="bill-upload"
                                        type="file"
                                        className="hidden"
                                        ref={attachmentFile}
                                        onChange={(e) => handleAttachmentFileChange(e)}
                                    />
                                </div>

                                {/* Manual Input */}
                                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
                                    <div className="text-5xl mb-3">✍️</div>
                                    <h3 className="text-xl font-semibold mb-2">Insert Manually</h3>
                                    <p className="text-gray-600 mb-4">
                                        Prefer to type? Add items yourself and split instantly.
                                    </p>
                                    <button className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
                                        Add Items
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    )
}

export default LandingPage