import { ChangeDetectorRef, Component } from '@angular/core';
import { Fixture, RoundEnum } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { Result } from '../../models/result/result';
import { TeamService } from '../../services/team/team.service';
import { GroupTable } from '../../models/group-table/group-table';
import { ResultService } from '../../services/result/result.service';
import { GroupTableComponent } from '../../components/group-table/group-table.component';
import { ScoresListComponent } from '../../components/scores-list/scores-list.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [GroupTableComponent, ScoresListComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];
  public groupTables?: GroupTable[];
  public r16Fixtures?: Fixture[];
  public r16Results?: Result[];
  public qfFixtures?: Fixture[];
  public qfResults?: Result[];
  public sfFixtures?: Fixture[];
  public sfResults?: Result[];
  public fFixtures?: Fixture[];
  public fResults?: Result[];

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private teamService: TeamService, private resultService: ResultService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getFixtures(),
      this.teamService.getTeams(),
      this.resultService.getResults(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fixtures, teams, results]) => {
        this.fixtures = fixtures;

        this.groupTables = GroupTable.calculateGroupTables(fixtures, results, teams);

        GroupTable.resolveR16Fixtures(fixtures, this.groupTables);
        this.r16Fixtures = fixtures.filter(r => r.round === RoundEnum.R16)
        this.r16Results = results.filter(r => r.round === RoundEnum.R16)
        if (!this.r16Results) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.r16Results, RoundEnum.QF);
        this.qfFixtures = fixtures.filter(r => r.round === RoundEnum.QF)
        this.qfResults = results.filter(r => r.round === RoundEnum.QF)
        if (!this.qfResults) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.qfResults, RoundEnum.SF);
        this.sfFixtures = fixtures.filter(r => r.round === RoundEnum.SF)
        this.sfResults = results.filter(r => r.round === RoundEnum.SF)
        if (!this.sfResults) {
          return;
        }

        GroupTable.resolveKnockoutFixtures(fixtures, this.sfResults, RoundEnum.F);
        this.fFixtures = fixtures.filter(r => r.round === RoundEnum.F)
        this.fResults = results.filter(r => r.round === RoundEnum.F);

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
