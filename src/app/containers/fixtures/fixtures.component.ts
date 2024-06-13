import { ChangeDetectorRef, Component } from '@angular/core';
import { Fixture, RoundEnum } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PredictionService } from '../../services/prediction/prediction.service';
import { Result } from '../../models/result/result';
import { TeamService } from '../../services/team/team.service';

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
  public predictions?: Result[];

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private venueService: VenueService, private teamService: TeamService, private predictionService: PredictionService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getFixtures(),
      this.venueService.getVenues(),
      this.teamService.getTeams(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixtures, venues, teams]) => {
        this.fixtures = fixtures;
        this.venues = venues;

        this.predictions = this.fixtures
          ?.filter(f => f.round === RoundEnum.Group)
          .map(f => {
            const homeTeam = teams.find(t => t.name === f.home);
            const awayTeam = teams.find(t => t.name === f.away);
            return (!homeTeam || !awayTeam)? 
              new Result({}) : 
              this.predictionService.getPrediction(homeTeam, awayTeam);
          });

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getGroupPrediction(fixture: Fixture) {
    return fixture.round !== RoundEnum.Group? 
      undefined :
      this.predictions?.find(p => p.home === fixture.home && p.away === fixture.away);
  }
}
