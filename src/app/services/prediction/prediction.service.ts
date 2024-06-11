import { Injectable } from '@angular/core';
import { Team } from '../../models/team/team';
import { Result } from '../../models/result/result';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  public getPrediction(homeTeam: Team, awayTeam: Team) {
    if (homeTeam.ranking < awayTeam.ranking - 3) {
      return new Result({
        home: homeTeam.name,
        away: awayTeam.name,
        homeGoals: 1,
        awayGoals: 0
      });
    } else if (awayTeam.ranking < homeTeam.ranking - 3) {
      return new Result({
        home: homeTeam.name,
        away: awayTeam.name,
        homeGoals: 0,
        awayGoals: 1
      });
    } else {
      return new Result({
        home: homeTeam.name,
        away: awayTeam.name,
        homeGoals: 0,
        awayGoals: 0
      });
    }
  }
}
