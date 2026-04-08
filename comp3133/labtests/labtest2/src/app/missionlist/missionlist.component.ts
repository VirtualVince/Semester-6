import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';

@Component({
  selector: 'app-missionlist',
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
      next: (data) => {
        this.missions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load missions.';
        this.loading = false;
      }
    });
  }

  viewDetails(mission: Mission): void {
    this.router.navigate(['/mission', mission.flight_number]);
  }
}
