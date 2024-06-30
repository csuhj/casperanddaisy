export interface IResult {
    home: string;
    away: string;
    round: string;
    homeGoals: number;
    homeShootoutPenalties?: number;
    awayGoals: number;
    awayShootoutPenalties?: number;
    extraTime?: boolean
}