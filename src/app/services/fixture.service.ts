import { Injectable } from '@angular/core';
import { Fixture, RoundEnum } from '../models/fixture/fixture';
import { Venue } from '../models/venue/venue';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  private fixtures: Fixture[];

  constructor() { 
    this.fixtures = [
      new Fixture({
        match: 1,
        dateTime: new Date('2024-06-14T20:00:00'),
        round: RoundEnum.Group,
        groupName: 'A',
        home: 'Germany',
        away: 'Scotland',
        venue: new Venue({
          city: 'Munich',
          stadium: 'Allianz Arena'
        })
      })
    ];
  }

  public getFixtures() {
    return this.fixtures;
  }

  public getNextFixture() {
    return this.fixtures
      .sort((a, b)=> a.dateTime.getTime() - b.dateTime.getTime())
      .find(f => f.dateTime.getTime() > Date.now());
  }
}
