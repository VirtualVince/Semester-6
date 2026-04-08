import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';

@Component({
  selector: 'app-missionfilter',
  templateUrl: './missionfilter.component.html',
  styleUrls: ['./missionfilter.component.css']
})
export class MissionfilterComponent implements OnInit {
  years: string[] = [];
  missions: Mission[] = [];
  selectedYear = '';
  loading = false;
  allMissions: Mission[] = [];

  constructor(private spaceApiService: SpaceapiService, private router: Router) {}

  ngOnInit(): void {
    this.spaceApiService.getAllLaunches().subscribe((data) => {
      this.allMissions = data;
      const yearSet = new Set(data.map(m => m.launch_year));
      this.years = Array.from(yearSet).sort();
      this.missions = data;
    });
  }

  filterByYear(year: string): void {
    this.selectedYear = year;
    this.loading = true;
    this.spaceApiService.getLaunchesByYear(year).subscribe({
      next: (data) => {
        this.missions = data;
        this.loading = false;
      },
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
