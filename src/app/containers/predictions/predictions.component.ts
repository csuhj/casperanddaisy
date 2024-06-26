import { ChangeDetectorRef, Component } from '@angular/core';
import { Fixture, RoundEnum } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { PredictionService } from '../../services/prediction/prediction.service';
import { Result } from '../../models/result/result';
import { TeamService } from '../../services/team/team.service';
import { GroupTable } from '../../models/group-table/group-table';
import { Team } from '../../models/team/team';
import { GroupTableComponent } from '../../components/group-table/group-table.component';
import { ScoresListComponent } from '../../components/scores-list/scores-list.component';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [GroupTableComponent, ScoresListComponent],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.scss'
})
export class PredictionsComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];
  public groupTables?: GroupTable[];
  public r16Results?: Result[];
  public qfResults?: Result[];
  public sfResults?: Result[];
  public fResults?: Result[];

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private teamService: TeamService, private predictionService: PredictionService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getFixtures(),
      this.teamService.getTeams(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixtures, teams]) => {
        this.fixtures = fixtures;

        const groupResults = this.predictResultsForRound(RoundEnum.Group, teams);
        if (!groupResults) {
          return;
        }

        this.groupTables = GroupTable.calculateGroupTables(fixtures, groupResults, teams);

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
        this.fResults = this.predictResultsForRound(RoundEnum.F, teams);

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
