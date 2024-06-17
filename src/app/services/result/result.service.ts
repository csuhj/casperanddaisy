import { Injectable } from '@angular/core';
import { RoundEnum } from '../../models/fixture/fixture';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResults } from '../../api-interface/results/results.interface';
import { Result, ResultTypeEnum } from '../../models/result/result';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) { 
  }

  public getResults() {
    return this.http.get<IResults>("./assets/results.json")
    .pipe(
      map((results) => results?.results?.map(r => {
        return new Result({
          home: r.home,
          away: r.away,
          homeGoals: r.homeGoals,
          homeShootoutPenalties: r.homeShootoutPenalties,
          awayGoals: r.awayGoals,
          awayShootoutPenalties: r.awayShootoutPenalties,
          round: RoundEnum[r.round as keyof typeof RoundEnum],
          type: ResultTypeEnum.Actual,
        });
      }) ?? []
    ));
  }
}
