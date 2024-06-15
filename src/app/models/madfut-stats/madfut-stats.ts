export class MadfutStats {
    public bestDefender: number;
    public rankedSquadPlayers: number; //number of base cards with ranking at or above 84
    public bestKeeper: number;
    public top5Attackers: number[];

    public get bestAttacker(): number {
        return this.top5Attackers?.length > 0? this.top5Attackers[0] : 0;
    }


    public constructor(team: Partial<MadfutStats>) {
        this.bestDefender = team?.bestDefender ?? 0;
        this.rankedSquadPlayers = team?.rankedSquadPlayers ?? 0;
        this.bestKeeper = team?.bestKeeper ?? 0;
        this.top5Attackers = team?.top5Attackers ?? [0, 0, 0, 0, 0];
    }
}