import { Component, OnInit } from '@angular/core';
import { Participant } from '../../models/participant.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  displayedColumns: string[] = ['idPart', 'nom', 'prenom', 'tache'];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.eventService.getAllParticipants().subscribe(data => {
      this.participants = data;
    });
  }
}
