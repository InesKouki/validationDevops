import { Logistics } from "./logistics.model";
import { Participant } from "./participant.model";

export interface Event {
    idEvent: number;
    description: string;
    dateDebut: string;
    dateFin: string;
    cout: number;
    participants: Participant[];
    logistics: Logistics[];
}