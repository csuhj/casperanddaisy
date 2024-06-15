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

    if (homeTeam.madfut.bestAttacker > awayTeam.madfut.bestDefender + 2) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.bestAttacker > homeTeam.madfut.bestDefender + 2) {
      awayGoals += 1;
    } 

    if (homeTeam.madfut.rankedSquadPlayers > awayTeam.madfut.rankedSquadPlayers + 2) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.rankedSquadPlayers > homeTeam.madfut.rankedSquadPlayers + 2) {
      awayGoals += 1;
    }

    if (homeTeam.ranking < awayTeam.ranking - 5) {
      homeGoals += 1;
    }
    if (awayTeam.ranking < homeTeam.ranking - 5) {
      awayGoals += 1;
    }

    if (homeGoals === awayGoals && round !== RoundEnum.Group) {
      homeShootoutPenalties = homeTeam.madfut.top5Attackers.reduce((partialSum, a) => partialSum + (a + 5 > awayTeam.madfut.bestKeeper? 1 : 0), 0);
      awayShootoutPenalties = awayTeam.madfut.top5Attackers.reduce((partialSum, a) => partialSum + (a + 5 > homeTeam.madfut.bestKeeper? 1 : 0), 0);

      if (homeShootoutPenalties < 2) {
        homeShootoutPenalties = 2;
      }
      if (awayShootoutPenalties < 2) {
        awayShootoutPenalties = 2;
      }

      if (homeShootoutPenalties === awayShootoutPenalties) {
        if (homeTeam.ranking < awayTeam.ranking) {
          homeShootoutPenalties += 1;
        } else {
          awayShootoutPenalties += 1;
        }
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
