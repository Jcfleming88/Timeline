export class Node {
    id: number;
    date: Date;
    name: string;
    grouping: string;
    description: string;
    pos: number;
    layer: number;

    constructor(id: number, date: Date, name: string, grouping: string, description: string, pos: number, layer: number) {
        this.id = id;
        this.date = date;
        this.name = name;
        this.grouping = grouping || "";
        this.description = description || "";
        this.pos = pos;
        this.layer = layer;
    }
}