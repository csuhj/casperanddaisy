export class GroupTableEntry {
    public team: string;
    public played: number;
    public for: number;
    public against: number;
    public points: number;

    public get goalDifference() {
        return this.for - this.against;
    }

    public constructor(groupTableEntry: Partial<GroupTableEntry>) {
        this.team = groupTableEntry?.team ?? '';
        this.played = groupTableEntry?.played ?? 0;
        this.for = groupTableEntry?.for ?? 0;
        this.against = groupTableEntry?.against ?? 0;
        this.points = groupTableEntry?.points ?? 0;
    }

    public static sortTableEntries(entries: GroupTableEntry[]) {
        entries.sort((x, y) => {
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