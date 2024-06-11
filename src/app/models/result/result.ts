export enum ResultTypeEnum {
    Actual = 'Actual',
    Prediction = 'Prediction'
}

export class Result {
    public home: string;
    public homeGoals: number;
    public away: string;
    public awayGoals: number;
    public type: ResultTypeEnum;

    public constructor(result: Partial<Result>) {
        this.home = result?.home ?? '';
        this.homeGoals = result?.homeGoals ?? 0;
        this.away = result?.away ?? '';
        this.awayGoals = result?.awayGoals ?? 0;
        this.type = result?.type ?? ResultTypeEnum.Actual;
    }

    public resultString(): string {
        if (this.homeGoals > this.awayGoals) {
            return `${this.home} win!`;
        } else if (this.awayGoals > this.homeGoals) {
            return `${this.away} win!`;
        } else {
            return 'Draw!';
        }
    }

    public scoreLineString(): string {
        return `${this.homeGoals} - ${this.awayGoals}`;
    }
}