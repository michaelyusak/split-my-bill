import React from 'react'

const LandingPage = (): React.ReactElement => {
    return (
        <>
            <main className="flex flex-col items-center justify-center flex-1 text-center px-6">
                <h2 className="text-4xl font-bold mb-4">Split bills the easy way</h2>
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
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                            Upload Bill
                        </button>
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
            </main>
        </>
    )
}

export default LandingPage