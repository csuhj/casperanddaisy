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

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  public fixtures?: Fixture[];
  public venues?: Venue[];
  public groupTables?: GroupTable[];

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

        const results = this.fixtures
          ?.filter(f => f.round === RoundEnum.Group)
          .map(f => {
            const homeTeam = teams.find(t => t.name === f.home);
            const awayTeam = teams.find(t => t.name === f.away);
            return (!homeTeam || !awayTeam)? 
              new Result({}) : 
              this.predictionService.getPrediction(homeTeam, awayTeam);
          });

        const groupResults = 
          Result.groupResults(results, (home, away) => 
            fixtures.find(f => f.home === home && f.away === away)?.groupName ?? ''
          );

        this.groupTables = [];
        Object.keys(groupResults).sort().forEach(groupName => {
          const resultsForGroup = groupResults?.[groupName];
          if (resultsForGroup) {
            const groupTable = new GroupTable({
              groupName: groupName,
              results: resultsForGroup,
            });

            groupTable.calculate();
            groupTable.sortTable();
            this.groupTables?.push(groupTable);
          }
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
