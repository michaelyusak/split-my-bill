import React, { useState } from "react"

interface EditableDateProps {
    content: number   // expect ISO format like "2025-09-17"
    customClassName?: string
    onConfirm: (newDate: number) => void
    isMaxToday?: boolean
    onError: (msg: string) => void
}

const EditableDate = ({ content, customClassName, onConfirm, isMaxToday, onError }: EditableDateProps): React.ReactElement => {
    const [isEditing, setIsEditing] = useState(false)
    const [dateValue, setDateValue] = useState<number>(content)
    const [dateInput, setDateInput] = useState<string>((new Date(content).toISOString().split("T")[0]))

    const exitEditing = () => {
        onConfirm(dateValue)
        setIsEditing(false)
    }

    const handleDateInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        const epoch = new Date(dateStr).getTime();
        const today = new Date();

        // always keep user input so partial values ("202", "2025-") don't crash
        if (isNaN(epoch)) {
            setDateInput(dateStr);
            return;
        }

        // prevent future dates
        if (epoch > today.getTime()) {
            setDateInput(today.toISOString().split("T")[0]);
            setDateValue(today.getTime())

            onError("❌ You can’t select a future date")

            return;
        }

        setDateInput(dateStr);
        setDateValue(epoch)
    }

    return (
        <div className={`mb-6 ${customClassName}`}>
            {isEditing ? (
                <input
                    type="date"
                    className="text-xl text-center font-medium border-b border-gray-400 focus:outline-none"
                    value={dateInput}
                    onChange={(e) => handleDateInputOnChange(e)}
                    onBlur={() => exitEditing()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            exitEditing()
                        } else if (e.key === "Escape") {
                            setIsEditing(false) // cancel edit without confirm
                        }
                    }}
                    max={isMaxToday ? new Date().toISOString().split("T")[0] : undefined}
                    autoFocus
                />
            ) : (
                <p
                    className={`text-xl font-medium cursor-pointer border-b border-transparent`}
                    onClick={() => setIsEditing(true)}
                >
                    {dateValue ? new Date(dateValue).toLocaleDateString() : "Click to set date"}
                </p>
            )}
        </div>
    )
}

export default EditableDate
