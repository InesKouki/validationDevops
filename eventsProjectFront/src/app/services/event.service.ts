import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Participant } from '../models/participant.model';
import { Logistics } from '../models/logistics.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://192.168.33.10:8088/event';

  constructor(private http: HttpClient) {}

  addParticipant(participant: Participant): Observable<Participant> {
    return this.http.post<Participant>(`${this.baseUrl}/addPart`, participant);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/addEvent`, event);
  }

  addEventPart(event: Event, idPart: number): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/addEvent/${idPart}`, event);
  }

  addAffectLog(logistics: Logistics, descriptionEvent: string): Observable<Logistics> {
    return this.http.put<Logistics>(`${this.baseUrl}/addAffectLog/${descriptionEvent}`, logistics);
  }

  getLogistiquesDates(d1: string, d2: string): Observable<Logistics[]> {
    return this.http.get<Logistics[]>(`${this.baseUrl}/getLogs/${d1}/${d2}`);
  }

  getAllParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.baseUrl}/allParticipants`);
  }
}
