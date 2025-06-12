export class Event {
    name: string;
    date: Date;

    grouping?: string;
    description?: string;

    constructor(name: string, date: Date, grouping?: string, description?: string) {
        this.name = name;
        this.date = date;

        this.description = description;
        this.grouping = grouping;
    }
}