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
import { GroupTable } from '../../models/group-table/group-table';
import { Team } from '../../models/team/team';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];
  public groupTables?: GroupTable[];
  public r16Results?: Result[];
  public qfResults?: Result[];
  public sfResults?: Result[];
  public fResult?: Result;

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

        const groupResults = this.predictResultsForRound(RoundEnum.Group, teams);
        if (!groupResults) {
          return;
        }

        const resultsPerGroup = 
          Result.groupResults(groupResults, (home, away) => 
            fixtures.find(f => f.home === home && f.away === away)?.groupName ?? ''
          );

        this.groupTables = GroupTable.calculateGroupTables(resultsPerGroup);

        GroupTable.resolveR16Fixtures(fixtures, this.groupTables);
        this.r16Results = this.predictResultsForRound(RoundEnum.R16, teams);
        if (!this.r16Results) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.r16Results, RoundEnum.QF);
        this.qfResults = this.predictResultsForRound(RoundEnum.QF, teams);
        if (!this.qfResults) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.qfResults, RoundEnum.SF);
        this.sfResults = this.predictResultsForRound(RoundEnum.SF, teams);
        if (!this.sfResults) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.sfResults, RoundEnum.F);
        this.fResult = this.predictResultsForRound(RoundEnum.F, teams)?.[0];

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private predictResultsForRound(round: RoundEnum, teams: Team[]) {
    return this.fixtures
      ?.filter(f => f.round === round)
      .map(f => {
        const homeTeam = teams.find(t => t.name === f.home);
        const awayTeam = teams.find(t => t.name === f.away);
        return (!homeTeam || !awayTeam)? 
          new Result({}) : 
          this.predictionService.getPrediction(homeTeam, awayTeam, round);
      });
  }
}
