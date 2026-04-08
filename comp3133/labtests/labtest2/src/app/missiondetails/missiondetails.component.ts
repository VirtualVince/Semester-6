import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';

@Component({
  selector: 'app-missiondetails',
  templateUrl: './missiondetails.component.html',
  styleUrls: ['./missiondetails.component.css']
})
export class MissiondetailsComponent implements OnInit {
  mission: Mission | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spaceApiService: SpaceapiService
  ) {}

  ngOnInit(): void {
    const flightNumber = Number(this.route.snapshot.paramMap.get('id'));
    this.spaceApiService.getMissionDetails(flightNumber).subscribe({
      next: (data) => {
        this.mission = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load mission details.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
