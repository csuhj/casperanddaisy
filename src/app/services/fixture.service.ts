import { Injectable } from '@angular/core';
import { Fixture, RoundEnum } from '../models/fixture/fixture';
import { Venue } from '../models/venue/venue';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IFixtures } from '../api-interface/fixtures/fixtures.interface';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  constructor(private http: HttpClient) { 
  }

  public getFixtures() {
    return this.http.get<IFixtures>("./assets/fixtures.json")
    .pipe(
      map((fixtures) => fixtures?.fixtures?.map(f => {
        const dateString = f.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
        return new Fixture({
          match: f.match,
          dateTime: new Date(`${dateString}T${f.time}:00`),
          round: RoundEnum[f.round as keyof typeof RoundEnum],
          groupName: f.groupName,
          home: f.home,
          away: f.away,
          venue: new Venue({
            city: f.venue,
            stadium: 'The Arena'
          })
        });
      }) ?? []
    ));
  }

  public getNextFixture() {
    return this.getFixtures().pipe(
      map((fixtures) => fixtures
        .sort((a, b)=> a.dateTime.getTime() - b.dateTime.getTime())
        .find(f => f.dateTime.getTime() > Date.now())
      )
    );
  }
}
