import React, { useState } from "react";
import { RxPencil1 } from "react-icons/rx";

type editablePProps = {
  content: string
  customClassName?: string
  placeholder?: string
  onChange: (title: string) => void
}

const EditableP = ({ content, customClassName, placeholder, onChange }: editablePProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false);
  const [initialValue, setInitialValue] = useState(content)

  const exitEditing = () => {
    setIsEditing(false)
    setInitialValue(content)
  }

  const exitEditingAndUndo = () => {
    setIsEditing(false)
    onChange(initialValue)
  }

  return (
    <div className={`${customClassName}`}>
      {isEditing ? (
        <input
          className={`h-full w-full text-center border-b-1 border-gray-400 focus:outline-none`}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => exitEditing()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              exitEditing()
            } else if (e.key === "Escape") {
              exitEditingAndUndo()
            }
          }}
          placeholder={placeholder}
          autoFocus
        />
      ) : (
        <div className="flex w-full justify-center h-full items-center gap-1">
          <p
            className={`h-full cursor-pointer flex justify-center items-center`}
            onClick={() => setIsEditing(true)}
          >
            {content || placeholder}
          </p>
          <button
            onKeyDown={(e) => {
              e.key === "Enter" && setIsEditing(true)
            }}
          >
            <RxPencil1></RxPencil1>
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableP;
