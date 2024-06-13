import { Injectable } from '@angular/core';
import { Team } from '../../models/team/team';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITeams } from '../../api-interface/teams/teams.interface';
import { MadfutStats } from '../../models/madfut-stats/madfut-stats';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { 
  }

  public getTeams() {
    return this.http.get<ITeams>("./assets/teams.json")
    .pipe(
      map((teams) => teams?.teams?.map(t => {
        return new Team({
          name: t.name,
          ranking: t.ranking,
          madfut: !t.madfut ? undefined : new MadfutStats({
            bestAttacker: t.madfut.bestAttacker,
            bestDefender: t.madfut.bestDefender,
            rankedSquadPlayers: t.madfut.rankedSquadPlayers,
          })
        });
      }) ?? []
    ));
  }
}
