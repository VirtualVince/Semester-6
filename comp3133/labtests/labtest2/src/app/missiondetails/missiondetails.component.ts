import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Mission } from '../models/mission';
import { SpaceapiService } from '../network/spacexapi.service';

@Component({
  selector: 'app-missiondetails',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
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
      next: (data) => { this.mission = data; this.loading = false; },
      error: () => { this.error = 'Failed to load mission details.'; this.loading = false; }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}