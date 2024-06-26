import { Fixture, RoundEnum } from "../fixture/fixture";
import { GroupTableEntry } from "../group-table-entry/group-table-entry";
import { Result } from "../result/result";
import { Team } from "../team/team";

export class GroupTable {
    // See https://www.uefa.com/euro2024/news/028e-1b3221d55b32-0a95528a80d5-1000--uefa-euro-2024-best-third-placed-teams/
    private static readonly group3rdPlacePermutations: {[name: string]: {[fixture: string]: string}} = {
        ['ABCD']: {['3ADEF']: '3A', ['3DEF']: '3D', ['3ABCD']: '3B', ['3ABC']: '3C'},
        ['ABCE']: {['3ADEF']: '3A', ['3DEF']: '3E', ['3ABCD']: '3B', ['3ABC']: '3C'},
        ['ABCF']: {['3ADEF']: '3A', ['3DEF']: '3F', ['3ABCD']: '3B', ['3ABC']: '3C'},
        ['ABDE']: {['3ADEF']: '3D', ['3DEF']: '3E', ['3ABCD']: '3A', ['3ABC']: '3B'},
        ['ABDF']: {['3ADEF']: '3D', ['3DEF']: '3F', ['3ABCD']: '3A', ['3ABC']: '3B'},
        ['ABEF']: {['3ADEF']: '3E', ['3DEF']: '3F', ['3ABCD']: '3B', ['3ABC']: '3A'},
        ['ACDE']: {['3ADEF']: '3E', ['3DEF']: '3D', ['3ABCD']: '3C', ['3ABC']: '3A'},
        ['ACDF']: {['3ADEF']: '3F', ['3DEF']: '3D', ['3ABCD']: '3C', ['3ABC']: '3A'},
        ['ACEF']: {['3ADEF']: '3E', ['3DEF']: '3F', ['3ABCD']: '3C', ['3ABC']: '3A'},
        ['ADEF']: {['3ADEF']: '3E', ['3DEF']: '3F', ['3ABCD']: '3D', ['3ABC']: '3A'},
        ['BCDE']: {['3ADEF']: '3E', ['3DEF']: '3D', ['3ABCD']: '3B', ['3ABC']: '3C'},
        ['BCDF']: {['3ADEF']: '3F', ['3DEF']: '3D', ['3ABCD']: '3C', ['3ABC']: '3B'},
        ['BCEF']: {['3ADEF']: '3F', ['3DEF']: '3E', ['3ABCD']: '3C', ['3ABC']: '3B'},
        ['BDEF']: {['3ADEF']: '3F', ['3DEF']: '3E', ['3ABCD']: '3D', ['3ABC']: '3B'},
        ['CDEF']: {['3ADEF']: '3F', ['3DEF']: '3E', ['3ABCD']: '3D', ['3ABC']: '3C'},
    }

    public groupName: string;
    public teams: Team[];
    public entries: GroupTableEntry[];
    public results: Result[];

    public constructor(groupTable: Partial<GroupTable>) {
        this.groupName = groupTable?.groupName ?? '';
        this.teams = groupTable?.teams ?? [];
        this.entries = groupTable?.entries ?? [];
        this.results = groupTable?.results ?? [];
    }

    public calculate() {
        this.entries = this.teams.map(team => {
            const resultsInvolvingTeam = this.results.filter(r => r.home === team.name || r.away === team.name);
            return new GroupTableEntry({
                team: team.name,
                played: resultsInvolvingTeam.length,
                won: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + (r.winner === team.name? 1: 0), 0),
                lost: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + (r.winner !== undefined && r.winner !== team.name? 1: 0), 0),
                drawn: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + (r.winner === undefined? 1: 0), 0),
                for: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + r.goalsForTeam(team.name), 0),
                against: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + r.goalsAgainstTeam(team.name), 0),
                points: resultsInvolvingTeam.reduce((partialSum, r) => partialSum + r.pointsForTeam(team.name), 0),
            });
        }
        );
    }

    public sortTable() {
        GroupTableEntry.sortTableEntries(this.entries);
    }

    public static calculateGroupTables(fixtures: Fixture[], results: Result[], teams: Team[]) {
        const groupResults = results.filter(r => r.round === RoundEnum.Group)
        if (!groupResults) {
          return [];
        }

        const resultsPerGroup = 
          Result.groupResults(groupResults, (home, away) => 
            fixtures.find(f => f.home === home && f.away === away)?.groupName ?? ''
          );
        
        const teamsPerGroup = Fixture.getTeamsPerGroup(fixtures, teams);
        return GroupTable.calculateGroupTablesGivenGroupings(teamsPerGroup, resultsPerGroup);
    }

    public static resolveR16Fixtures(fixtures: Fixture[], groupTables: GroupTable[]) {
        const thirdPlaceTableEntries: GroupTableEntry[] = [];
        const teamToGroupMap: {[team:string]: string} = {};
        groupTables.forEach(groupTable => {
            GroupTable.applyFixtureFromGroupTable(fixtures, groupTable, `1${groupTable.groupName}`);
            GroupTable.applyFixtureFromGroupTable(fixtures, groupTable, `2${groupTable.groupName}`);

            thirdPlaceTableEntries.push(groupTable.entries[2]);
            teamToGroupMap[groupTable.entries[2].team] = groupTable.groupName;
        })

        GroupTableEntry.sortTableEntries(thirdPlaceTableEntries);
        const groupAndTeam = thirdPlaceTableEntries.map(e => {return {group: teamToGroupMap[e.team], team: e.team}});

        this.resolveR163rdPlacePermutations(fixtures, groupAndTeam);
    }

    public static resolveKnockoutFixtures(fixtures: Fixture[], previousRoundResults: Result[], round: RoundEnum) {
        switch(round) {
            case RoundEnum.QF:
            case RoundEnum.SF:
            case RoundEnum.F:
                fixtures.filter(f => f.round === round).forEach(fixture => {
                    GroupTable.applyFixtureFromKnockoutResult(fixtures, previousRoundResults, fixture.home);
                    GroupTable.applyFixtureFromKnockoutResult(fixtures, previousRoundResults, fixture.away);
                })
                break;
            default:
                throw new Error(`Can't resolve knockout fixtures from previous round results for the round ${round}`);
        }
    }

    private static calculateGroupTablesGivenGroupings(teamsPerGroup: {[groupName: string]: Team[]}, resultsPerGroup: {[groupName: string]: Result[]}) {
        const groupTables: GroupTable[] = [];
        Object.keys(teamsPerGroup).sort().forEach(groupName => {
          const teamsForGroup = teamsPerGroup[groupName];
          const resultsForGroup = resultsPerGroup?.[groupName] ?? [];
          const groupTable = new GroupTable({
            groupName: groupName,
            teams: teamsForGroup,
            results: resultsForGroup,
          });

          groupTable.calculate();
          groupTable.sortTable();
          groupTables?.push(groupTable);
        });
        return groupTables;
    }

    private static resolveR163rdPlacePermutations(fixtures: Fixture[], groupAndTeam: {group: string, team: string}[]) {
        const permutationGroups = [groupAndTeam[0].group, groupAndTeam[1].group, groupAndTeam[2].group, groupAndTeam[3].group];
        const permutationName = permutationGroups.sort().reduce((partialName, n) => partialName + n, '');
        const permutation = GroupTable.group3rdPlacePermutations[permutationName];
        if (!permutation) {
            return;
        }

        Object.keys(permutation).forEach(fixtureName => {
            const group = permutation[fixtureName]?.substring(1,2);
            const team = groupAndTeam.find(gt => gt.group === group)?.team;
            if (team) {
                GroupTable.applyTeamToFixture(fixtures, fixtureName, team);
            }
        })
    }

    private static applyFixtureFromGroupTable(fixtures: Fixture[], groupTable: GroupTable, fixtureName: string) {
        const tableIndex = parseInt(fixtureName.substring(0, 1)) - 1; 
        GroupTable.applyTeamToFixture(fixtures, fixtureName, groupTable.entries[tableIndex].team)
    }

    private static applyFixtureFromKnockoutResult(fixtures: Fixture[], previousRoundResults: Result[], fixtureName: string) {
        const matchNumber = parseInt(fixtureName.substring(1, 3));
        const referencedFixture = fixtures.find(f => f.match === matchNumber);
        if (!referencedFixture) {
            return;
        }
        const referencedResult = previousRoundResults.find(r => r.home === referencedFixture.home && r.away === referencedFixture.away);
        if (!referencedResult || !referencedResult.winner) {
            return;
        }

        GroupTable.applyTeamToFixture(fixtures, fixtureName, referencedResult.winner)
    }

    private static applyTeamToFixture(fixtures: Fixture[], fixtureName: string, teamName: string) {
        const fixture = fixtures.find(f => f.home === fixtureName || f.away === fixtureName);
        if (!fixture) {
            return;
        }

        if (fixture.home === fixtureName) {
            fixture.home = teamName;
        } else if (fixture.away === fixtureName) {
            fixture.away = teamName;
        }
    }
}