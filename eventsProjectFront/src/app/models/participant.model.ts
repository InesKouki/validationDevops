export interface Participant {
    idPart: number;
    nom: string;
    prenom: string;
    tache: Tache;
    events: Event[];
}

export enum Tache {
    INVITE = "INVITE",
    ORGANISATEUR = "ORGANISATEUR",
    SERVEUR = "SERVEUR",
    ANIMATEUR = "ANIMATEUR"
}