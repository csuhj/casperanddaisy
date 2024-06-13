import { ChangeDetectorRef, Component } from '@angular/core';
import { Fixture } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './fixtures.component.html',
  styleUrl: './fixtures.component.scss'
})
export class FixturesComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private venueService: VenueService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getFixtures(),
      this.venueService.getVenues(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixtures, venues]) => {
        this.fixtures = fixtures;
        this.venues = venues;

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
