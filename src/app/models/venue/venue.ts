export class Venue {
    public city: string;
    public stadium: string;

    public constructor(fixture: Partial<Venue>) {
        this.city = fixture?.city ?? '';
        this.stadium = fixture?.stadium ?? '';
    }
}