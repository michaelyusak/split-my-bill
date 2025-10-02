import React, { useEffect, useState } from "react";
import type { AllowedContactTypes, Contact, Participant } from "../interfaces/Participant";
import { HandleGet, HandlePost } from "../utils/API";
import EditableP from "./EditableP";
import { FiTrash } from "react-icons/fi";
import { IsValidEmail } from "../utils/Email";
import { IsValidWhatsappNumber } from "../utils/Whatsapp";
import { useToast } from "../contexts/ToastContext";

type participantModalProps = {
    receiptId: number
    defaultValue?: Participant
    onClose: () => void
    onSuccess?: <T>(data: T) => void
    onFail?: () => void
}

const ParticipantModal = ({ receiptId, defaultValue, onClose, onSuccess, onFail }: participantModalProps): React.ReactElement => {
    const { addToast } = useToast()

    const [name, setName] = useState(defaultValue?.participant_name || "");
    const [contacts, setContacts] = useState<Contact[]>([])
    // const [avatar, setAvatar] = useState(DefaultAvatar);
    const [allowedContactTypes, setAllowedContactTypes] = useState<string[]>([])
    const [isNotifying, setIsNotifying] = useState<boolean>(true)
    const [noticeIntervalUnit, setNoticeIntervalUnit] = useState<string>("d")
    const [noticeIntervalValue, setNoticeIntervalValue] = useState<string>("1")

    const handleAddContact = () => {
        setContacts((prev) => [
            ...prev,
            { contact_type: "", contact_value: "", contact_id: contacts.length, created_at: 0, participant_id: defaultValue?.participant_id ?? 0 }
        ])
    }

    const handleDeleteContact = (key: number) => {
        const newContacts: Contact[] = []

        contacts.forEach((contact) => {
            if (contact.contact_id !== key) {
                const newContact: Contact = { ...contact, contact_id: newContacts.length }
                newContacts.push(newContact)
            }
        })

        setContacts(newContacts)
    }

    const handleContactTypeOnChange = (contactId: number, contactType: string) => {
        const newContacts: Contact[] = []

        contacts.forEach((contact) => {
            if (contact.contact_id === contactId) {
                const newContact: Contact = { ...contact, contact_type: contactType, contact_value: "" }
                newContacts.push(newContact)
            } else {
                newContacts.push(contact)
            }
        })

        setContacts(newContacts)
    }

    const handleContactValueOnChange = (contactId: number, contactValue: string) => {
        const newContacts: Contact[] = []

        contacts.forEach((contact) => {
            if (contact.contact_id == contactId) {
                const newContact: Contact = { ...contact, contact_value: contactValue }
                newContacts.push(newContact)
            } else {
                newContacts.push(contact)
            }
        })

        setContacts(newContacts)
    }

    const handleAddParticipant = () => {
        var isError = false

        if (name === "") {
            isError = true
            addToast(`participantModal:emptyName:${Date.now()}`, "Name can't be empty", false, false, 3 * 1000)
        }

        contacts.forEach((contact) => {
            if (contact.contact_type === "" || contact.contact_value === "") {
                isError = true
                addToast(`participantModal:emptyContact:${Date.now()}`, "Contact detail can't be empty", false, false, 3 * 1000)
            }

            if (contact.contact_type == "email" && !IsValidEmail(contact.contact_value)) {
                isError = true
                addToast(`participantModal:invalidEmail:${Date.now()}`, "Invalid email", false, false, 3 * 1000)
            } else if (contact.contact_type == "whatsapp" && !IsValidWhatsappNumber(contact.contact_value)) {
                isError = true
                addToast(`participantModal:invalidWhatsapp:${Date.now()}`, "Invalid whatsapp number", false, false, 3 * 1000)
            }
        })

        if (isError) {
            return
        }

        var noticeInterval: string = ""

        if (["d", "w"].includes(noticeIntervalUnit)) {
            switch (noticeIntervalUnit) {
                case "d":
                    noticeInterval = `${+noticeIntervalValue * 24}h`
                    break
                case "w":
                    noticeInterval = `${+noticeIntervalValue * 24 * 7}h`
                    break
            }
        } else {
            noticeInterval = noticeIntervalValue + noticeIntervalUnit
        }

        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/receipt/${receiptId}/participant`
        const data: {
            participants: Participant[]
        } = {
            participants: [
                {
                    participant_name: name,
                    contacts: contacts,
                    notifying: isNotifying,
                    notice_interval: noticeInterval
                }
            ]
        }

        HandlePost(url, JSON.stringify(data)).
            then((data) => {
                addToast(`participantModal:successAddParticipant:${Date.now()}`, "✅ Participant Added", true, false, 3 * 1000)

                onSuccess && onSuccess<typeof data>(data)
            }).
            catch(() => {
                addToast(`participantModal:failAddParticipant:${Date.now()}`, "Something went wrong", false, false, 3 * 1000)

                onFail && onFail()
            })
    }

    const fetchAllowedContactTypes = () => {
        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/contact-types`

        HandleGet<AllowedContactTypes>(url).
            then((data) => {
                if (data.allowed_contact_types.length < 1) {
                    throw Error
                }
                setAllowedContactTypes(data.allowed_contact_types)
            }).
            catch(() => {
                addToast(`participantModal:failedGetAllowedContactTypes:${Date.now()}`, "Something went wrong", false, false, 3 * 1000)
            })
    }

    useEffect(() => {
        fetchAllowedContactTypes()
    }, [])

    useEffect(() => {
        if (contacts.length > 0) {
            const newContacts: Contact[] = []

            contacts.forEach((contact, i) => {
                const newContact: Contact = { ...contact, contact_id: i }
                newContacts.push(newContact)
            })

            setContacts(newContacts)
        }
    }, [defaultValue])

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 z-0"
                onClick={() => onClose()}
            ></div>

            <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 w-[70%] h-[80%] flex flex-col items-center justify-between">
                <div className="w-full flex flex-col gap-2 items-center">
                    <h2 className="text-lg font-bold mb-4">{defaultValue ? "Update" : "Add"}</h2>

                    <div className="flex flex-col gap-5 items-center w-full">
                        {/* <div
                            className="w-[50%] aspect-square border-2 border-gray-800 rounded-full 
                                flex items-center justify-center overflow-hidden">
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            ></img>
                        </div> */}

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />

                        <div className="w-full flex justify-between items-center">
                            <div
                                className="flex gap-1 py-1"
                            >
                                <input
                                    id="isNotifyingCheckbox"
                                    type="checkbox"
                                    checked={isNotifying}
                                    onChange={(e) => setIsNotifying(e.target.checked)}
                                >
                                </input>
                                <p
                                    className="flex items-center"
                                >
                                    Notify this person?
                                </p>
                            </div>

                            {isNotifying && (
                                <div className="flex justify-end w-1/2 gap-2">
                                    <p
                                        className="flex items-center"
                                    >
                                        Notify every
                                    </p>

                                    <div
                                        className="flex border-1 border-gray-500 rounded-md px-2"
                                    >
                                        <input
                                            className="w-[50px] border-r-1 border-gray-600"
                                            value={noticeIntervalValue}
                                            onChange={(e) => {
                                                const value = e.target.value

                                                if (!isNaN(+value)) {
                                                    const floored = Math.floor(+value)

                                                    setNoticeIntervalValue(floored.toString())
                                                }
                                            }}
                                            onBlur={() => {
                                                if (isNaN(+noticeIntervalValue) || +noticeIntervalValue < 1) {
                                                    setNoticeIntervalValue("1")
                                                }
                                            }}
                                        ></input>

                                        <select
                                            value={noticeIntervalUnit}
                                            onChange={(e) => {
                                                const value = e.target.value

                                                if (["m", "h", "d", "w"].includes(value)) {
                                                    setNoticeIntervalUnit(value)
                                                }
                                            }}
                                        >
                                            <option value="m">Minute</option>
                                            <option value="h">Hour</option>
                                            <option value="d">Day</option>
                                            <option value="w">Week</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full flex justify-between">
                            <h3 className="text-left text-lg">Contacts</h3>

                            <button
                                onClick={() => handleAddContact()}
                                className="text-sm text-white bg-gray-500 px-2 py-1 rounded-xl">
                                New Contact
                            </button>
                        </div>

                        <div className="w-full flex- flex-col">
                            {contacts.map((contact, i) => (
                                <div className="w-full border-gray-500 border-b-1 flex justify-between p-2 gap-3" key={i}>
                                    <div className="w-full flex justify-start gap-2 items-center">
                                        <select
                                            value={contact.contact_type || ""}
                                            onChange={(e) => handleContactTypeOnChange(contact.contact_id, e.target.value)}
                                            className="border-1 rounded-xl px-2 py-1"
                                        >
                                            <option
                                                disabled
                                                value=""
                                            >
                                                Select contact type
                                            </option>
                                            {allowedContactTypes.map((allowedContactType, j) => (
                                                <option key={j} value={allowedContactType}>{allowedContactType}</option>
                                            ))}
                                        </select>

                                        <EditableP
                                            content={contact.contact_value}
                                            placeholder={
                                                contact.contact_type === "email"
                                                    ? "e.g. email@example.com"
                                                    : contact.contact_type === "whatsapp"
                                                        ? "e.g. 6281112345678"
                                                        : allowedContactTypes.join(" or ")
                                            }
                                            customClassName="w-[60%] h-full"
                                            onChange={(value: string) => handleContactValueOnChange(contact.contact_id, value)}
                                        ></EditableP>
                                    </div>

                                    <button onClick={() => handleDeleteContact(contact.contact_id)}>
                                        <FiTrash color="red" size={25}></FiTrash>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleAddParticipant()}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        {defaultValue ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ParticipantModal;