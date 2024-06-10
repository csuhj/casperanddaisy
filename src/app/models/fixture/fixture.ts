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

    public constructor(fixture: Partial<Fixture>) {
        this.match = fixture?.match ?? 1;
        this.dateTime = fixture?.dateTime ?? new Date(2024, 0, 1, 12, 0, 0);
        this.home = fixture?.home ?? '';
        this.away = fixture?.away ?? '';
        this.round = fixture?.round ?? RoundEnum.Group;
        this.groupName = fixture?.groupName ?? '';
        this.venueCity = fixture?.venueCity ?? '';
    }
}