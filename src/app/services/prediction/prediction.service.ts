import { Injectable } from '@angular/core';
import { Team } from '../../models/team/team';
import { Result, ResultTypeEnum } from '../../models/result/result';
import { RoundEnum } from '../../models/fixture/fixture';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  public getPrediction(homeTeam: Team, awayTeam: Team, round: RoundEnum) {
    let homeGoals = 0;
    let awayGoals = 0;
    let homeShootoutPenalties: number | undefined;
    let awayShootoutPenalties: number | undefined;

    if (homeTeam.madfut.bestAttacker > awayTeam.madfut.bestDefender + 3) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.bestAttacker > homeTeam.madfut.bestDefender + 3) {
      awayGoals += 1;
    } 

    if (homeTeam.madfut.rankedSquadPlayers > awayTeam.madfut.rankedSquadPlayers + 3) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.rankedSquadPlayers > homeTeam.madfut.rankedSquadPlayers + 3) {
      awayGoals += 1;
    }

    if (homeTeam.ranking < awayTeam.ranking - 5) {
      homeGoals += 1;
    }
    if (awayTeam.ranking < homeTeam.ranking - 5) {
      awayGoals += 1;
    }

    if (homeGoals === awayGoals && round !== RoundEnum.Group) {
      if (homeTeam.ranking < awayTeam.ranking) {
        homeShootoutPenalties = 5;
        awayShootoutPenalties = 4;
      } else {
        homeShootoutPenalties = 4;
        awayShootoutPenalties = 5;
      }
    }

    return new Result({
      home: homeTeam.name,
      away: awayTeam.name,
      homeGoals,
      awayGoals,
      homeShootoutPenalties,
      awayShootoutPenalties,
      type: ResultTypeEnum.Prediction
    });
  }
}
