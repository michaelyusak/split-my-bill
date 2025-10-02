import React, { useState } from "react";

type editableH2Props = {
  content: string
  customClassName?: string
  onConfirm: (title: string) => void
}

const EditableH2 = ({ content, customClassName, onConfirm }: editableH2Props): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content);

  const exitEditing = () => {
    onConfirm(title)
    setIsEditing(false)
  }

  return (
    <div className={`mb-6 ${customClassName}`}>
      {isEditing ? (
        <input
          className={`text-3xl text-center font-bold border-b-1 border-gray-400 focus:outline-none`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => exitEditing()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              exitEditing()
            } else if (e.key === "Escape") {
              setIsEditing(false) // cancel edit without confirm
            }
          }}
          autoFocus
        />
      ) : (
        <h2
          className={`text-3xl font-bold cursor-pointer border-b border-transparent`}
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h2>
      )}
    </div>
  );
}

export default EditableH2;
