export class Team {
    public name: string;
    public ranking: number;

    public constructor(team: Partial<Team>) {
        this.name = team?.name ?? '';
        this.ranking = team?.ranking ?? 0;
    }
}