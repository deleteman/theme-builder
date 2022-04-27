import { v4 as uuid} from 'uuid'
import * as DeltaE from 'delta-e'

const MAX_SCORE = 999999;
const MUTATION_RATE = 0.05;

let template = {
    "data" : {
        "light" : {
            "id": "T_001",
            "name": "Light",
            "colors": {
                "body": "#FFFFFF",
                "text": "#000000",
                "button": {
                    "text": "#FFFFFF",
                    "background": "#000000"
                },
                "link": {
                    "text": "teal",
                    "opacity": 1
                }
            },
            "font": "#eeeeee"
        }
    }
}

const POPULATION_SIZE = 100;
let _data = {
    "generation": 1,
    "data": {}
}

function getRandomFontName() {
    let list = ["Roboto", "Akshar", "Square Peg", "Open Sans", "Ms Madi", "Lato", "Updock"]
    return list[Math.round(Math.random() * (list.length - 1))]
}

function getRandomHexColor() {
    let r = Math.round(Math.random() * 255).toString(16).padStart(2, "0")
    let g = Math.round(Math.random() * 255).toString(16).padStart(2, "0")
    let b = Math.round(Math.random() * 255).toString(16).padStart(2, "0")

    return "#" + r+g+b
}

export function generateRandomPopulation(total) {
    if(!total) total = POPULATION_SIZE
    _data.data = {}

    for(let i = 0; i < total; i++) {
        let id = uuid()
        _data.data[id] = {
            "id": id,
            "good_this_generation": false,
            "score": 0,
            "name": "Theme #" + i,
            "colors": {
                "body": getRandomHexColor(),
                "text": getRandomHexColor(),
                "button": {
                    "text": getRandomHexColor(),
                    "background": getRandomHexColor()
                },
                "link": {
                    "text": getRandomHexColor(),
                    "opacity": 1
                }
            },
            "font": getRandomFontName()

        }
    }
    return _data;
}

function crossGenes(f, m) {
    let value = Math.random() > 0.5 ? f : m;
    if(Math.random() > (1 - MUTATION_RATE)) { //mutate
        console.log("MUTATION!")
        return getRandomHexColor()
    }
    return value;
}

export function makeBaby(f, m, i) {
    let baby = {
        "id": uuid(),
        "good_this_generation": false,
        "score": 0,
        "name": "Baby #" + i,
        "colors": {
            "body": crossGenes(f.colors.body, m.colors.body),
            "text": crossGenes(f.colors.text, m.colors.text),
            "button": {
                "text": crossGenes(f.colors.button.text, m.colors.button.text),
                "background": crossGenes(f.colors.button.background, m.colors.button.background),
            },
            "link": {
                "text": crossGenes(f.colors.link.text, m.colors.link.text),
                "opacity": 1
            }
        },
        "font": Math.random() > 0.5 ? f.font: m.font
    }
    return baby;
}

export function breedPopulation(parents) {
    let parentsA = parents.slice(0, 25)
    let parentsB = parents.slice(25, 50);

    let offsprings = parentsA.map( (f, idx) => {
        return makeBaby(f, parentsB[idx], idx)
    })
    return offsprings
}

export function getColorDistance(a, b) {
    let colorsA = a.match(/#([A-Z0-9]{2})([A-Z0-9]{2})([A-Z0-9]{2})/i)
    let colorsB = b.match(/#([A-Z0-9]{2})([A-Z0-9]{2})([A-Z0-9]{2})/i)

    colorsA = colorsA.slice(1).map( c => parseInt(c, 16))
    colorsB = colorsB.slice(1).map( c => parseInt(c, 16))

    let distance = DeltaE.getDeltaE00({L: colorsA[0], A: colorsA[1], B: colorsA[2]},
                                {L: colorsB[0], A: colorsB[1], B: colorsB[2]},
    )
    return distance
}

export function getDistance(theme, ideal) {
    return getColorDistance(theme.colors.body, ideal.colors.body) +
    getColorDistance(theme.colors.button.text, ideal.colors.button.text) +
    getColorDistance(theme.colors.button.background, ideal.colors.button.background) +
    getColorDistance(theme.colors.link.text, ideal.colors.link.text) +
    ((theme.font != ideal.font) ? 10 : 0);
}

export function getThemeScore(theme, ideals) {
    let score = 0;

    score = ideals.reduce((prev, curr) => prev + getDistance(theme, curr), score)
    if(score === 0) return 0.0001
    return score;
}

export const calculateDistances = (picks, rest) => {
    let withScores = picks.map( p => { 
        p.score = MAX_SCORE;
        return p;
    })
    withScores = [...withScores, ...(rest.map( r => {
        r.score = 1/getThemeScore(r, picks) //the further the distance the lower the score
        return r;
    }))]

    return withScores
}

