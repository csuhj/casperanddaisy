import { MadfutStats } from "../../models/madfut-stats/madfut-stats";

export interface ITeam {
    name: string;
    ranking: number;
    madfut: MadfutStats;
}