import { Fixture, RoundEnum } from "../fixture/fixture";
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
        GroupTableEntry.sortTableEntries(this.entries);
    }

    public static calculateGroupTables(groupResults: {[groupName: string]: Result[]}) {
        const groupTables: GroupTable[] = [];
        Object.keys(groupResults).sort().forEach(groupName => {
          const resultsForGroup = groupResults?.[groupName];
          if (resultsForGroup) {
            const groupTable = new GroupTable({
              groupName: groupName,
              results: resultsForGroup,
            });

            groupTable.calculate();
            groupTable.sortTable();
            groupTables?.push(groupTable);
          }
        });
        return groupTables;
    }

    public static resolveR16Fixtures(fixtures: Fixture[], groupTables: GroupTable[]) {
        const thirdPlaceTableEntries: GroupTableEntry[] = [];
        groupTables.forEach(groupTable => {
            GroupTable.applyFixtureFromGroupTable(fixtures, groupTable, `1${groupTable.groupName}`);
            GroupTable.applyFixtureFromGroupTable(fixtures, groupTable, `2${groupTable.groupName}`);

            thirdPlaceTableEntries.push(groupTable.entries[2]);
        })

        //TODO: Actually work out proper rules here!
        GroupTableEntry.sortTableEntries(thirdPlaceTableEntries);
        GroupTable.applyTeamToFixture(fixtures, '3DEF', thirdPlaceTableEntries[0].team)
        GroupTable.applyTeamToFixture(fixtures, '3ADEF', thirdPlaceTableEntries[1].team)
        GroupTable.applyTeamToFixture(fixtures, '3ABC', thirdPlaceTableEntries[2].team)
        GroupTable.applyTeamToFixture(fixtures, '3ABCD', thirdPlaceTableEntries[3].team)
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
}