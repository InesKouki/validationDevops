import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { ParticipantAddComponent } from './components/participant-add/participant-add.component';


const routes: Routes = [
  { path: 'participants', component: ParticipantListComponent },
  { path: 'add-participant', component: ParticipantAddComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
