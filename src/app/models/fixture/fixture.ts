import { Team } from "../team/team";

export enum RoundEnum {
    Group = 'Group',
    R16 = 'R16',
    QF = 'QF',
    SF = 'SF',
    F = 'F'
}

export class Fixture {
    public match: number;
    public dateTime: Date;
    public home: string;
    public away: string;
    public round: RoundEnum;
    public groupName: string;
    public venueCity: string;

    public get isToday() {
      return this.dateTime.toDateString() === new Date(Date.now()).toDateString();
    }

    public constructor(fixture: Partial<Fixture>) {
        this.match = fixture?.match ?? 1;
        this.dateTime = fixture?.dateTime ?? new Date(2024, 0, 1, 12, 0, 0);
        this.home = fixture?.home ?? '';
        this.away = fixture?.away ?? '';
        this.round = fixture?.round ?? RoundEnum.Group;
        this.groupName = fixture?.groupName ?? '';
        this.venueCity = fixture?.venueCity ?? '';
    }

    public static getTeamsPerGroup(fixtures: Fixture[], teams: Team[]) {
        const teamsPerGroup: {[groupName: string]: Team[]} = {};
        fixtures.filter(f => f.round === RoundEnum.Group).forEach(fixture => {
          let teamsInGroup = teamsPerGroup[fixture.groupName];
          if (!teamsInGroup) {
            teamsInGroup = [];
            teamsPerGroup[fixture.groupName] = teamsInGroup;
          }
          if (!teamsInGroup.find(t => t.name === fixture.home)) {
            const homeTeam = teams.find(t => t.name === fixture.home);
            if (homeTeam) {
                teamsInGroup.push(homeTeam);
            }
          }
          if (!teamsInGroup.find(t => t.name === fixture.away)) {
            const awayTeam = teams.find(t => t.name === fixture.away);
            if (awayTeam) {
                teamsInGroup.push(awayTeam);
            }
          }
        });
    
        return teamsPerGroup;
    }
}