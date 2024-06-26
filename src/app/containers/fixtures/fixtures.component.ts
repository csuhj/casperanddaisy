import { ChangeDetectorRef, Component } from '@angular/core';
import { Fixture, RoundEnum } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { DatePipe, NgStyle } from '@angular/common';
import { PredictionService } from '../../services/prediction/prediction.service';
import { Result } from '../../models/result/result';
import { TeamService } from '../../services/team/team.service';
import { ResultService } from '../../services/result/result.service';
import { GroupTable } from '../../models/group-table/group-table';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [DatePipe, NgStyle],
  templateUrl: './fixtures.component.html',
  styleUrl: './fixtures.component.scss'
})
export class FixturesComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];
  public predictions?: Result[];

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private venueService: VenueService, private teamService: TeamService, private predictionService: PredictionService, private resultService: ResultService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getFixtures(),
      this.venueService.getVenues(),
      this.teamService.getTeams(),
      this.resultService.getResults(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixtures, venues, teams, results]) => {
        this.fixtures = fixtures;
        this.venues = venues;

        const groupTables = GroupTable.calculateGroupTables(fixtures, results, teams);
        GroupTable.resolveR16Fixtures(fixtures, groupTables);
        GroupTable.resolveKnockoutFixtures(fixtures, results.filter(r => r.round === RoundEnum.R16), RoundEnum.QF);
        GroupTable.resolveKnockoutFixtures(fixtures, results.filter(r => r.round === RoundEnum.QF), RoundEnum.SF);
        GroupTable.resolveKnockoutFixtures(fixtures, results.filter(r => r.round === RoundEnum.SF), RoundEnum.F);

        this.predictions = this.fixtures
          ?.map(f => {
            const homeTeam = teams.find(t => t.name === f.home);
            const awayTeam = teams.find(t => t.name === f.away);
            return (!homeTeam || !awayTeam)? 
              new Result({}) : 
              this.predictionService.getPrediction(homeTeam, awayTeam, f.round);
          });

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getGroupPrediction(fixture: Fixture) {
    return this.predictions?.find(p => p.home === fixture.home && p.away === fixture.away && p.round === fixture.round);
  }
}
