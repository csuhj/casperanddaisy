export class MadfutStats {
    public bestAttacker: number;
    public bestDefender: number;
    public rankedSquadPlayers: number; //number of base cards with ranking at or above 84

    public constructor(team: Partial<MadfutStats>) {
        this.bestAttacker = team?.bestAttacker ?? 0;
        this.bestDefender = team?.bestDefender ?? 0;
        this.rankedSquadPlayers = team?.rankedSquadPlayers ?? 0;
    }
}