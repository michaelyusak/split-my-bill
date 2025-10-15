import { useEffect, useState } from "react";
import type { GetParticipantsResponse, Participant } from "../interfaces/Participant";
import ParticipantModal from "./ParticipantModal";
import { DefaultAvatar } from "../assets";
import { HandleGet } from "../utils/API";

type receiptParticipantListProps = {
    receiptId: number
}

const ReceiptParticipantList = ({ receiptId }: receiptParticipantListProps): React.ReactElement => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selected, setSelected] = useState<Participant | null>(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const fetchParticipants = () => {
        const url = import.meta.env.VITE_RECEIPT_DETECTOR_BASE_URL + `/receipt/${receiptId}/participant`

        HandleGet<GetParticipantsResponse>(url).
            then((data) => {
                setParticipants(data.participants)
            }).
            catch(() => {

            })
    }

    const updateParticipant = () => {
        fetchParticipants()
        setSelected(null); // close modal
    };

    const addParticipant = () => {
        fetchParticipants()
        setIsNewModalOpen(false);
    };

    useEffect(() => {
        fetchParticipants()
    }, [receiptId])

    return (
        <div>
            {/* PARTICIPANT GRID */}
            <div className="grid grid-cols-5 gap-4">
                {participants.map((p) => (
                    <button
                        key={p.participant_id}
                        onClick={() => setSelected(p)}
                        className="w-16 h-16 rounded-full overflow-hidden border hover:scale-105 transition"
                    >
                        <img src={p.avatar ?? DefaultAvatar} alt={`${p.participant_id}`} className="w-full h-full object-cover" />
                    </button>
                ))}

                {/* New Participant */}
                <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl text-gray-500 hover:bg-gray-100"
                >
                    +
                </button>
            </div>

            {/* EDIT PARTICIPANT MODAL */}
            {selected && (
                <ParticipantModal
                    receiptId={receiptId}
                    defaultValue={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={(_) => updateParticipant()}
                ></ParticipantModal>
            )}

            {/* NEW PARTICIPANT MODAL */}
            {isNewModalOpen && (
                <ParticipantModal
                    receiptId={receiptId}
                    onClose={() => setIsNewModalOpen(false)}
                    onSuccess={(_) => addParticipant()}
                />
            )}
        </div>
    );
}

export default ReceiptParticipantList;