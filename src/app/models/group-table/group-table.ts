import { GroupTableEntry } from "../group-table-entry/group-table-entry";
import { Result } from "../result/result";

export class GroupTable {
    public groupName: string;
    public entries: GroupTableEntry[];
    public results: Result[];

    public constructor(groupTable: Partial<GroupTable>) {
        this.groupName = groupTable?.groupName ?? '';
        this.entries = groupTable?.entries ?? [];
        this.results = groupTable?.results ?? [];
    }

    public calculate() {
        switch (this.groupName)
        {
            case 'A':
                this.entries = [
                    new GroupTableEntry({ team: 'Germany', played: 3, points: 7, for: 6, against: 1}),
                    new GroupTableEntry({ team: 'Switzerland', played: 3, points: 7, for: 5, against: 1}),
                    new GroupTableEntry({ team: 'Hungary', played: 3, points: 3, for: 1, against: 5}),
                    new GroupTableEntry({ team: 'Scotland', played: 3, points: 0, for: 0, against: 6})
                ];
                break;                

            case 'B':
                this.entries = [
                    new GroupTableEntry({ team: 'Italy', played: 3, points: 9, for: 6, against: 0}),
                    new GroupTableEntry({ team: 'Spain', played: 3, points: 6, for: 4, against: 1}),
                    new GroupTableEntry({ team: 'Croatia', played: 3, points: 3, for: 3, against: 3}),
                    new GroupTableEntry({ team: 'Albania', played: 3, points: 0, for: 0, against: 9})
                ];
                break;

            case 'C':
                this.entries = [
                    new GroupTableEntry({ team: 'England', played: 3, points: 9, for: 9, against: 0}),
                    new GroupTableEntry({ team: 'Denmark', played: 3, points: 6, for: 3, against: 3}),
                    new GroupTableEntry({ team: 'Serbia', played: 3, points: 3, for: 2, against: 4}),
                    new GroupTableEntry({ team: 'Slovenia', played: 3, points: 0, for: 0, against: 7})
                ];
                break;

            case 'D':
                this.entries = [
                    new GroupTableEntry({ team: 'Netherlands', played: 3, points: 7, for: 6, against: 2}),
                    new GroupTableEntry({ team: 'France', played: 3, points: 5, for: 6, against: 2}),
                    new GroupTableEntry({ team: 'Poland', played: 3, points: 4, for: 5, against: 6}),
                    new GroupTableEntry({ team: 'Austria', played: 3, points: 0, for: 1, against: 7})
                ];
                break;

            case 'E':
                this.entries = [
                    new GroupTableEntry({ team: 'Belgium', played: 3, points: 9, for: 8, against: 1}),
                    new GroupTableEntry({ team: 'Ukraine', played: 3, points: 4, for: 4, against: 3}),
                    new GroupTableEntry({ team: 'Slovakia', played: 3, points: 4, for: 3, against: 3}),
                    new GroupTableEntry({ team: 'Romania', played: 3, points: 0, for: 0, against: 7})
                ];
                break;

            case 'F':
                this.entries = [
                    new GroupTableEntry({ team: 'Portugal', played: 3, points: 9, for: 9, against: 0}),
                    new GroupTableEntry({ team: 'Turkey', played: 3, points: 6, for: 4, against: 5}),
                    new GroupTableEntry({ team: 'Czechia', played: 3, points: 1, for: 3, against: 7}),
                    new GroupTableEntry({ team: 'Georgia', played: 3, points: 1, for: 3, against: 7})
                ];
                break;
            }
    }

    public sortTable() {
        this.entries.sort((x, y) => {
            if (x.points !== y.points) {
                return y.points - x.points;
            }
            if (x.goalDifference !== y.goalDifference) {
                return y.goalDifference - x.goalDifference;
            }
            return x.team.localeCompare(y.team);
        });
    }
}