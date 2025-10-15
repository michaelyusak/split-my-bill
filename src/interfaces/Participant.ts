export interface Participant {
  participant_id?: number;
  participant_name: string;
  avatar?: string;
  receipt_id?: number;
  notifying: boolean;
  notice_interval: string;
  last_notice?: number;
  contacts: Contact[];
  created_at?: number;
  updated_at?: number;
};

export interface Contact {
  contact_id: number;
  participant_id: number;
  contact_type: string;
  contact_value: string;
  created_at: number;
  updated_at?: number;
}

export interface AllowedContactTypes {
  allowed_contact_types: string[]
}

export interface GetParticipantsResponse {
  participants: Participant[]
}