import { ChangeDetectorRef, Component } from '@angular/core';
import { NextFixtureComponent } from '../../components/next-fixture/next-fixture.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { PredictionComponent } from '../../components/prediction/prediction.component';
import { Fixture } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';
import { FixtureService } from '../../services/fixture/fixture.service';
import { VenueService } from '../../services/venue/venue.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { Result } from '../../models/result/result';
import { TeamService } from '../../services/team/team.service';
import { PredictionService } from '../../services/prediction/prediction.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, NextFixtureComponent, PredictionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public nextFixture?: Fixture;
  public nextFixtureVenue?: Venue;
  public nextFixturePrediction?: Result;

  private readonly destroy$ = new Subject<void>();

  public constructor(private changeDetectorRef: ChangeDetectorRef, private fixtureService: FixtureService, private venueService: VenueService, private teamService: TeamService, private predictionService: PredictionService) {}

  ngOnInit(): void {
    combineLatest([
      this.fixtureService.getNextFixture(),
      this.venueService.getVenues(),
      this.teamService.getTeams()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([nextFixture, venues, teams]) => {
        this.nextFixture = nextFixture;
        this.nextFixtureVenue = venues.find(v => v.city === nextFixture?.venueCity);

        const homeTeam = teams.find(t => t.name === nextFixture?.home);
        const awayTeam = teams.find(t => t.name === nextFixture?.away);
        const round = nextFixture?.round;
        if (homeTeam && awayTeam && round) {
          this.nextFixturePrediction = this.predictionService.getPrediction(homeTeam, awayTeam, round)
        } else {
          this.nextFixturePrediction = undefined;
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
