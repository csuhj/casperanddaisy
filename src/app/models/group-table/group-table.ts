import { Fixture, RoundEnum } from "../fixture/fixture";
import { GroupTableEntry } from "../group-table-entry/group-table-entry";
import { Result } from "../result/result";
import { Team } from "../team/team";

export class GroupTable {
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

    public static calculateGroupTables(teamsPerGroup: {[groupName: string]: Team[]}, resultsPerGroup: {[groupName: string]: Result[]}) {
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

        this.apply3rdPlaceTeamToFixture(fixtures, groupAndTeam, 'DEF');
        this.apply3rdPlaceTeamToFixture(fixtures, groupAndTeam, 'ADEF');
        this.apply3rdPlaceTeamToFixture(fixtures, groupAndTeam, 'ABC');
        this.apply3rdPlaceTeamToFixture(fixtures, groupAndTeam, 'ABCD');
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

    private static apply3rdPlaceTeamToFixture(fixtures: Fixture[], groupAndTeam: {group: string, team: string}[], groupsToSearchFor: string) {
        const groupsToSearchForArray = groupsToSearchFor.split('');
        const teamIndex = groupAndTeam.findIndex(gt => groupsToSearchForArray.find(g => g === gt.group) !== undefined);
        if (teamIndex < 0) {
            return;
        }

        const team = groupAndTeam[teamIndex].team;
        const fixtureName = `3${groupsToSearchFor}`;
        GroupTable.applyTeamToFixture(fixtures, fixtureName, team);

        groupAndTeam.splice(teamIndex, 1);
    }
}