import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';
 
@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './missionfilter.component.html',
  styleUrls: ['./missionfilter.component.css']
})
export class MissionfilterComponent implements OnInit {
  years: string[] = [];
  missions: Mission[] = [];
  allMissions: Mission[] = [];
  selectedYear = '';
  loading = false;
 
  constructor(private spaceApiService: SpaceapiService, private router: Router) {}
 
  ngOnInit(): void {
    this.spaceApiService.getAllLaunches().subscribe((data) => {
      this.allMissions = data;
      this.missions = data;
      const yearSet = new Set(data.map(m => m.launch_year));
      this.years = Array.from(yearSet).sort();
    });
  }
 
  filterByYear(year: string): void {
    this.selectedYear = year;
    this.loading = true;
    this.spaceApiService.getLaunchesByYear(year).subscribe({
      next: (data) => { this.missions = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
 
  clearFilter(): void {
    this.selectedYear = '';
    this.missions = this.allMissions;
  }
 
  viewDetails(mission: Mission): void {
    this.router.navigate(['/mission', mission.flight_number]);
  }
}