import { MadfutStats } from "../madfut-stats/madfut-stats";

export class Team {
    public name: string;
    public ranking: number;
    public madfut: MadfutStats;

    public constructor(team: Partial<Team>) {
        this.name = team?.name ?? '';
        this.ranking = team?.ranking ?? 0;
        this.madfut = team?.madfut ?? new MadfutStats({});
    }
}