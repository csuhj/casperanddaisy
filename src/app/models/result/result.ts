import { RoundEnum } from "../fixture/fixture";

export enum ResultTypeEnum {
    Actual = 'Actual',
    Prediction = 'Prediction'
}

export class Result {
    public home: string;
    public homeGoals: number;
    public homeShootoutPenalties?: number;
    public away: string;
    public awayGoals: number;
    public awayShootoutPenalties?: number;
    public round: RoundEnum;
    public type: ResultTypeEnum;

    public get winner() {
        if (this.homeGoals > this.awayGoals) {
            return this.home;
        } else if (this.awayGoals > this.homeGoals) {
            return this.away;
        } else {
            if (this.homeShootoutPenalties === undefined || this.awayShootoutPenalties === undefined) {
                return undefined;
            } else {
                if (this.homeShootoutPenalties > this.awayShootoutPenalties) {
                    return this.home
                } else if (this.awayShootoutPenalties > this.homeShootoutPenalties) {
                    return this.away
                } else {
                    return undefined;
                }
            }

        }
    }

    public constructor(result: Partial<Result>) {
        this.home = result?.home ?? '';
        this.homeGoals = result?.homeGoals ?? 0;
        this.homeShootoutPenalties = result?.homeShootoutPenalties;
        this.away = result?.away ?? '';
        this.awayGoals = result?.awayGoals ?? 0;
        this.awayShootoutPenalties = result?.awayShootoutPenalties;
        this.round = result?.round ?? RoundEnum.Group;
        this.type = result?.type ?? ResultTypeEnum.Actual;
    }

    public pointsForTeam(teamName: string) {
        if (this.winner == teamName) {
            return 3;
        } else if (this.winner === undefined) {
            return 1;
        } else {
            return 0;
        }
    }

    public goalsForTeam(teamName: string) {
        if (this.home == teamName) {
            return this.homeGoals;
        } else if (this.away === teamName) {
            return this.awayGoals;
        } else {
            return 0;
        }
    }

    public goalsAgainstTeam(teamName: string) {
        if (this.home == teamName) {
            return this.awayGoals;
        } else if (this.away === teamName) {
            return this.homeGoals;
        } else {
            return 0;
        }
    }

    public resultString(): string {
        if (this.homeGoals > this.awayGoals) {
            return `${this.home} win!`;
        } else if (this.awayGoals > this.homeGoals) {
            return `${this.away} win!`;
        } else {
            if (this.homeShootoutPenalties === undefined || this.awayShootoutPenalties === undefined) {
                return 'Draw!';
            } else {
                if (this.homeShootoutPenalties > this.awayShootoutPenalties) {
                    return `${this.home} win on penalties!`;
                } else if (this.awayShootoutPenalties > this.homeShootoutPenalties) {
                    return `${this.away} win on penalties!`;
                } else {
                    return 'Draw after penalty shootout!?!';
                }
            }
        }
    }

    public scoreLineString(): string {
        if (this.homeShootoutPenalties === undefined || this.awayShootoutPenalties === undefined) {
            return `${this.homeGoals} - ${this.awayGoals}`;
        } else {
            return `${this.homeGoals} - ${this.awayGoals} (${this.homeShootoutPenalties} - ${this.awayShootoutPenalties})`;
        }
    }

    public fullScoreLineString(): string {
        if (this.homeShootoutPenalties === undefined || this.awayShootoutPenalties === undefined) {
            return `${this.home} ${this.homeGoals} - ${this.awayGoals} ${this.away}`;
        } else {
            let penaltiesScoreLine;
            if (this.homeShootoutPenalties > this.awayShootoutPenalties) {
                penaltiesScoreLine = `${this.home} win ${this.homeShootoutPenalties} - ${this.awayShootoutPenalties} on penalties`;
            } else if (this.awayShootoutPenalties > this.homeShootoutPenalties) {
                penaltiesScoreLine = `${this.away} win ${this.awayShootoutPenalties} - ${this.homeShootoutPenalties} on penalties`;
            } else {
                penaltiesScoreLine = 'draw after penalty shootout!?!';
            }
            return `${this.home} ${this.homeGoals} - ${this.awayGoals} ${this.away} (${penaltiesScoreLine})`;
        }
    }

    public static groupResults(results: Result[], getGroupForFixture: (home: string, away: string) => string) {
        const groupResults: {[groupName: string]: Result[]} = {};
        results.forEach(result => {
          const group = getGroupForFixture(result.home, result.away);
          let resultsInGroup = groupResults[group];
          if (!resultsInGroup) {
            resultsInGroup = [];
            groupResults[group] = resultsInGroup;
          }
          resultsInGroup.push(result);
        });
    
        return groupResults;
    }
}