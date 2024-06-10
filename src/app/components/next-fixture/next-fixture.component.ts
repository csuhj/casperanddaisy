import { Component, OnDestroy, OnInit } from '@angular/core';
import { FixtureService } from '../../services/fixture/fixture.service';
import { Fixture } from '../../models/fixture/fixture';
import { DatePipe } from '@angular/common';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { VenueService } from '../../services/venue/venue.service';
import { Venue } from '../../models/venue/venue';

@Component({
  selector: 'app-next-fixture',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './next-fixture.component.html',
  styleUrl: './next-fixture.component.scss'
})
export class NextFixtureComponent implements OnInit, OnDestroy {
  public fixture?: Fixture;
  public venue?: Venue;

  private readonly destroy$ = new Subject<void>();

  public constructor(private fixtureService: FixtureService, private venueService: VenueService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getNextFixture(),
      this.venueService.getVenues()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixture, venues]) => {
        this.fixture = fixture;
        this.venue = venues.find(v => v.city === fixture?.venueCity);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
