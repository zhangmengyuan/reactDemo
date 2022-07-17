class Line {
    constructor() {
        this.strokeColor = 'black';
        this.mode = 'curve'
    }
} 
const line = () => new Line()

class Round {
    constructor(){
        this.strokeColor = "black";
    }
}
const round = () => new Round();

class Rect {
    constructor (){
        this.strokeColor = 'black';
    }
}
const rect = () => new Rect()

class Fill {
    constructor() {
        this.fillColor = 'white';
        this.fillColorable = true;
    }
}
const fill = () => new Fill()

export const funcs = {
    line,
    round,
    rect,
    fill
}