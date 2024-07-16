import { Component, OnInit } from '@angular/core';
import { Participant, Tache } from '../../models/participant.model';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participant-add',
  templateUrl: './participant-add.component.html',
  styleUrls: ['./participant-add.component.css']
})
export class ParticipantAddComponent implements OnInit {
  participant: Participant = {
    idPart: 0,
    nom: '',
    prenom: '',
    tache: Tache.INVITE,
    events: []
  };
  taches = Object.values(Tache);

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.eventService.addParticipant(this.participant).subscribe(data => {
      this.router.navigate(['/participants']);
    });
  }
}
