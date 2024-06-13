import { Injectable } from '@angular/core';
import { Team } from '../../models/team/team';
import { Result } from '../../models/result/result';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  public getPrediction(homeTeam: Team, awayTeam: Team) {
    let homeGoals = 0;
    let awayGoals = 0;

    if (homeTeam.madfut.bestAttacker > awayTeam.madfut.bestDefender) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.bestAttacker > homeTeam.madfut.bestDefender) {
      awayGoals += 1;
    } 

    if (homeTeam.madfut.rankedSquadPlayers > awayTeam.madfut.rankedSquadPlayers) {
      homeGoals += 1;
    }
    if (awayTeam.madfut.rankedSquadPlayers > homeTeam.madfut.rankedSquadPlayers) {
      awayGoals += 1;
    }

    if (homeTeam.ranking < awayTeam.ranking - 3) {
      homeGoals += 1;
    }
    if (awayTeam.ranking < homeTeam.ranking - 3) {
      awayGoals += 1;
    }

    return new Result({
      home: homeTeam.name,
      away: awayTeam.name,
      homeGoals,
      awayGoals
    });
  }
}
