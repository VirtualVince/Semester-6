import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './missionlist.component.html',
  styleUrls: ['./missionlist.component.css']
})
export class MissionlistComponent implements OnInit {
  missions: Mission[] = [];
  loading = true;
  error = '';

  constructor(private spaceApiService: SpaceapiService, private router: Router) {}

  ngOnInit(): void {
    this.spaceApiService.getAllLaunches().subscribe({
      next: (data) => { this.missions = data; this.loading = false; },
      error: () => { this.error = 'Failed to load missions.'; this.loading = false; }
    });
  }

  viewDetails(mission: Mission): void {
    this.router.navigate(['/mission', mission.flight_number]);
  }
}