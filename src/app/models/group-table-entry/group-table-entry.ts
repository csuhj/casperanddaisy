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
}