// recoilAtoms.js

import {atom} from "recoil";
import bible from "./data/bible.json";
import tbible from "./data/biblett.json";

const options = [{label: "Genesis", value: 1}, {label: "Exodus", value: 2}, {
    label: "Leviticus",
    value: 3
}, {label: "Numbers", value: 4}, {label: "Deuteronomy", value: 5}, {label: "Joshua", value: 6}, {
    label: "Judges",
    value: 7
}, {label: "Ruth", value: 8}, {label: "1 Samuel", value: 9}, {label: "2 Samuel", value: 10}, {
    label: "1 Kings",
    value: 11
}, {label: "2 Kings", value: 12}, {label: "1 Chronicles", value: 13}, {
    label: "2 Chronicles",
    value: 14
}, {label: "Ezra", value: 15}, {label: "Nehemiah", value: 16}, {label: "Esther", value: 17}, {
    label: "Job",
    value: 18
}, {label: "Psalm", value: 19}, {label: "Proverbs", value: 20}, {
    label: "Ecclesiastes",
    value: 21
}, {label: "Song of Solomon", value: 22}, {label: "Isaiah", value: 23}, {
    label: "Jeremiah",
    value: 24
}, {label: "Lamentations", value: 25}, {label: "Ezekiel", value: 26}, {label: "Daniel", value: 27}, {
    label: "Hosea",
    value: 28
}, {label: "Joel", value: 29}, {label: "Amos", value: 30}, {label: "Obadiah", value: 31}, {
    label: "Jonah",
    value: 32
}, {label: "Micah", value: 33}, {label: "Nahum", value: 34}, {label: "Habakkuk", value: 35}, {
    label: "Zephaniah",
    value: 36
}, {label: "Haggai", value: 37}, {label: "Zechariah", value: 38}, {label: "Malachi", value: 39}, {
    label: "Matthew",
    value: 40
}, {label: "Mark", value: 41}, {label: "Luke", value: 42}, {label: "John", value: 43}, {
    label: "Acts",
    value: 44
}, {label: "Romans", value: 45}, {label: "1 Corinthians", value: 46}, {
    label: "2 Corinthians",
    value: 47
}, {label: "Galatians", value: 48}, {label: "Ephesians", value: 49}, {
    label: "Philippians",
    value: 50
}, {label: "Colossians", value: 51}, {label: "1 Thessalonians", value: 52}, {
    label: "2 Thessalonians",
    value: 53
}, {label: "1 Timothy", value: 54}, {label: "2 Timothy", value: 55}, {label: "Titus", value: 56}, {
    label: "Philemon",
    value: 57
}, {label: "Hebrews", value: 58}, {label: "James", value: 59}, {label: "1 Peter", value: 60}, {
    label: "2 Peter",
    value: 61
}, {label: "1 John", value: 62}, {label: "2 John", value: 63}, {label: "3 John", value: 64}, {
    label: "Jude",
    value: 65
}, {label: "Revelation", value: 66},];
const ttb = [{label: "ఆదికాండము", value: 1}, {label: "నిర్గమకాండము", value: 2}, {
    label: "లేవీయకాండము",
    value: 3
}, {label: "సంఖ్యాకాండము", value: 4}, {label: "ద్వితీయోపదేశకాండము", value: 5}, {
    label: "యెహోషువ",
    value: 6
}, {label: "న్యాయాధిపతులు", value: 7}, {label: "రూతు", value: 8}, {label: "1 సమూయేలు", value: 9}, {
    label: "2 సమూయేలు",
    value: 10
}, {label: "1 రాజులు", value: 11}, {label: "2 రాజులు", value: 12}, {
    label: "1 దినవృత్తాంతములు",
    value: 13
}, {label: "2 దినవృత్తాంతములు", value: 14}, {label: "ఎజ్రా", value: 15}, {
    label: "నెహెమ్యా",
    value: 16
}, {label: "ఎస్తేరు", value: 17}, {label: "యోబు", value: 18}, {label: "కీర్తనలు", value: 19}, {
    label: "సామెతలు",
    value: 20
}, {label: "ప్రసంగి", value: 21}, {label: "పరమగీతము", value: 22}, {label: "యెషయా", value: 23}, {
    label: "యిర్మీయా",
    value: 24
}, {label: "విలాపవాక్యములు", value: 25}, {label: "యెహెజ్కేలు", value: 26}, {
    label: "దానియేలు",
    value: 27
}, {label: "హోషేయ", value: 28}, {label: "యోవేలు", value: 29}, {label: "ఆమోసు", value: 30}, {
    label: "ఓబద్యా",
    value: 31
}, {label: "యోనా", value: 32}, {label: "మీకా", value: 33}, {label: "నహూము", value: 34}, {
    label: "హబక్కూకు",
    value: 35
}, {label: "జెఫన్యా", value: 36}, {label: "హగ్గయి", value: 37}, {label: "జెకర్యా", value: 38}, {
    label: "మలాకీ",
    value: 39
}, {label: "మత్తయి", value: 40}, {label: "మార్కు", value: 41}, {label: "లూకా", value: 42}, {
    label: "యోహాను",
    value: 43
}, {label: "అపొస్తలుల కార్యములు", value: 44}, {label: "రోమా", value: 45}, {
    label: "1 కొరింథీయులకు",
    value: 46
}, {label: "2 కొరింథీయులకు", value: 47}, {label: "గలతీయులకు", value: 48}, {
    label: "ఎఫెసీయులకు",
    value: 49
}, {label: "ఫిలిప్పీయులకు", value: 50}, {label: "కొలొస్సయులకు", value: 51}, {
    label: "1 థెస్సలొనీకయులకు",
    value: 52
}, {label: "2 థెస్సలొనీకయులకు", value: 53}, {label: "1 తిమోతికి", value: 54}, {
    label: "2 తిమోతికి",
    value: 55
}, {label: "తీతుకు", value: 56}, {label: "ఫిలేమోనుకు", value: 57}, {label: "హెబ్రీయులకు", value: 58}, {
    label: "యాకోబు",
    value: 59
}, {label: "1 పేతురు", value: 60}, {label: "2 పేతురు", value: 61}, {label: "1 యోహాను", value: 62}, {
    label: "2 యోహాను",
    value: 63
}, {label: "3 యోహాను", value: 64}, {label: "యూదా", value: 65}, {label: "ప్రకటన", value: 66},];

// Hindi translations of the book names
// const tb = [
//     { label: "उत्पत्ति", value: 1 },
//     { label: "निर्गमन", value: 2 },
//     { label: "लैव्यवस्था", value: 3 },
//     { label: "गिनती", value: 4 },
//     { label: "व्यवस्थाओं का विवरण", value: 5 },
//     { label: "यहोशू", value: 6 },
//     { label: "न्यायियों", value: 7 },
//     { label: "रूत", value: 8 },
//     { label: "1 शमूएल", value: 9 },
//     { label: "2 शमूएल", value: 10 },
//     { label: "1 राजा", value: 11 },
//     { label: "2 राजा", value: 12 },
//     { label: "1 इतिहास", value: 13 },
//     { label: "2 इतिहास", value: 14 },
//     { label: "एज्रा", value: 15 },
//     { label: "नहेमायाह", value: 16 },
//     { label: "एस्तेर", value: 17 },
//     { label: "अय्यूब", value: 18 },
//     { label: "भजन संहिता", value: 19 },
//     { label: "नीतिवचन", value: 20 },
//     { label: "सभित्याचार", value: 21 },
//     { label: "श्रेष्ठ गीत", value: 22 },
//     { label: "यशायाह", value: 23 },
//     { label: "यिर्मयाह", value: 24 },
//     { label: "विलापगीत", value: 25 },
//     { label: "यहेजकेल", value: 26 },
//     { label: "दानिय्येल", value: 27 },
//     { label: "होशे", value: 28 },
//     { label: "योएल", value: 29 },
//     { label: "आमोस", value: 30 },
//     { label: "ओबद्दाह", value: 31 },
//     { label: "योना", value: 32 },
//     { label: "मीका", value: 33 },
//     { label: "नहूम", value: 34 },
//     { label: "हबक्कूक", value: 35 },
//     { label: "सपन्याह", value: 36 },
//     { label: "हाग्गै", value: 37 },
//     { label: "जकरियाह", value: 38 },
//     { label: "मलाकी", value: 39 },
//     { label: "मत्ती", value: 40 },
//     { label: "मरकुस", value: 41 },
//     { label: "लूका", value: 42 },
//     { label: "यूहन्ना", value: 43 },
//     { label: "प्रेरितों के काम", value: 44 },
//     { label: "रोमियों", value: 45 },
//     { label: "1 कुरिन्थीयों", value: 46 },
//     { label: "2 कुरिन्थीयों", value: 47 },
//     { label: "गलातियों", value: 48 },
//     { label: "इफिसियों", value: 49 },
//     { label: "फिलिप्पियों", value: 50 },
//     { label: "कुलुस्सियों", value: 51 },
//     { label: "1 थिस्सलुनीकियों", value: 52 },
//     { label: "2 थिस्सलुनीकियों", value: 53 },
//     { label: "1 तीमुथियुस", value: 54 },
//     { label: "2 तीमुथियुस", value: 55 },
//     { label: "तीतुस", value: 56 },
//     { label: "फिलेमोन", value: 57 },
//     { label: "इब्रानियों", value: 58 },
//     { label: "याकूब", value: 59 },
//     { label: "1 पतरस", value: 60 },
//     { label: "2 पतरस", value: 61 },
//     { label: "1 यूहन्ना", value: 62 },
//     { label: "2 यूहन्ना", value: 63 },
//     { label: "3 यूहन्ना", value: 64 },
//     { label: "यहूदा", value: 65 },
//     { label: "प्रकटणी", value: 66 }
//   ];



const bibleBooks = [{osis: "Gen", number: 1}, {osis: "Exod", number: 2}, {osis: "Lev", number: 3}, {
    osis: "Num",
    number: 4
}, {osis: "Deut", number: 5}, {osis: "Josh", number: 6}, {osis: "Judg", number: 7}, {
    osis: "Ruth",
    number: 8
}, {osis: "1Sam", number: 9}, {osis: "2Sam", number: 10}, {osis: "1Kgs", number: 11}, {
    osis: "2Kgs",
    number: 12
}, {osis: "1Chr", number: 13}, {osis: "2Chr", number: 14}, {osis: "Ezra", number: 15}, {
    osis: "Neh",
    number: 16
}, {osis: "Esth", number: 17}, {osis: "Job", number: 18}, {osis: "Ps", number: 19}, {
    osis: "Prov",
    number: 20
}, {osis: "Eccl", number: 21}, {osis: "Song", number: 22}, {osis: "Isa", number: 23}, {
    osis: "Jer",
    number: 24
}, {osis: "Lam", number: 25}, {osis: "Ezek", number: 26}, {osis: "Dan", number: 27}, {
    osis: "Hos",
    number: 28
}, {osis: "Joel", number: 29}, {osis: "Amos", number: 30}, {osis: "Obad", number: 31}, {
    osis: "Jonah",
    number: 32
}, {osis: "Mic", number: 33}, {osis: "Nah", number: 34}, {osis: "Hab", number: 35}, {
    osis: "Zeph",
    number: 36
}, {osis: "Hag", number: 37}, {osis: "Zech", number: 38}, {osis: "Mal", number: 39}, {
    osis: "Matt",
    number: 40
}, {osis: "Mark", number: 41}, {osis: "Luke", number: 42}, {osis: "John", number: 43}, {
    osis: "Acts",
    number: 44
}, {osis: "Rom", number: 45}, {osis: "1Cor", number: 46}, {osis: "2Cor", number: 47}, {
    osis: "Gal",
    number: 48
}, {osis: "Eph", number: 49}, {osis: "Phil", number: 50}, {osis: "Col", number: 51}, {
    osis: "1Thess",
    number: 52
}, {osis: "2Thess", number: 53}, {osis: "1Tim", number: 54}, {osis: "2Tim", number: 55}, {
    osis: "Titus",
    number: 56
}, {osis: "Phlm", number: 57}, {osis: "Heb", number: 58}, {osis: "Jas", number: 59}, {
    osis: "1Pet",
    number: 60
}, {osis: "2Pet", number: 61}, {osis: "1John", number: 62}, {osis: "2John", number: 63}, {
    osis: "3John",
    number: 64
}, {osis: "Jude", number: 65}, {osis: "Rev", number: 66},];

// Define atoms for each state variable
export const prevState = atom({
    key: "prevState",
    default: "",
});

export const bookState = atom({
    key: "bookState",
    default: {label: "Genesis", value: 1},
});

export const chapterState = atom({
    key: "chapterState",
    default: "",
});

export const verseState = atom({
    key: "verseState",
    default: "",
});

export const historyState = atom({
    key: "historyState",
    default: localStorage.getItem("h")
        ? JSON.parse(localStorage.getItem("h"))
        : [],
});

export const dynamicState = atom({
    key: "dynamicState",
    default: "",
});
const mc = new BroadcastChannel("mc");

export default function sendLive(mes) {
    mc.postMessage(mes);
    const s = JSON.parse(localStorage.getItem("s"));
    const ws = s && s.ws ? new WebSocket(`ws://${s.ws}:4488`) : null;
    if (ws) {
        ws.onopen = function () {
            console.log('WebSocket connection established.');
            ws.send(JSON.stringify({
                "request-type": "SetSourceSettings",
                "sourceName": "cpLive",
                "sourceSettings": {
                    "url": `data:text/html;charset=utf-8,
<div class="box" style="  
height: 100vh;
text-align: center;
overflow: hidden;
display: flex;
justify-content: center;
align-items: center;
font-family: Arial, sans-serif;
color: rgba(0, 0, 0, 0);
">
  ${encodeURIComponent(mes)}
</div>
`
                },
                "message-id": "1"
            }));
            ws.close();
        };
    }
}

export function getLive(l) {
    let br = "<br/>";
    let h = '<div class="cont" style="padding: 2vh;">';
    let f = "</div>";

    return (
        h +
        `
${
            l.e
                ? "<span>" +
                '<span class="english">' +
                l.e +
                "</span>" +
                '<span class="bra">' +
                br +
                "</span>" +
                "</span>"
                : ""
        }
${
            l.t
                ? "<span>" +
                '<span class="telugu">' +
                l.t +
                "</span>" +
                '<span class="brb">' +
                br +
                "</span>" +
                "</span>"
                : ""
        }
<span class="brc">${br}</span>
<span class="reference">${l.r}</span>
${f}`
    );
}

export function getRef(bookf, chapter, verse, tbd) {
    let s;
    try {
        s = JSON.parse(localStorage.getItem("s"));
    } catch (error) {
        console.error("Error occurred while parsing localStorage:", error);
    }

    let langAttribute = {};
    if (s && s.lang) {
        try {
            langAttribute = s.lang;
        } catch (error) {
            console.error("Error occurred while parsing lang attribute:", error);
        }
    }

    // Check and modify lang attribute
    if (langAttribute && langAttribute.telugu && langAttribute.english) {
        return "<span class='hyphen'>-</span><span class='english-book'>" + bookf.label + "</span><span class='comer'>,</span> <span class='telugu-book'>" + tbd + "</span> <span class='chapter'><span class='chapter-number'>" + chapter + "</span><span class='colon'>:</span></span><span class='verse'>" + verse + "</span>";
    } else if (
        langAttribute &&
        !langAttribute.telugu &&
        !langAttribute.english
    ) {
        return "<span class='hyphen'>-</span><span class='english-book'>" + bookf.label + "</span><span class='comer'>,</span> <span class='telugu-book'>" + tbd + "</span> <span class='chapter'><span class='chapter-number'>" + chapter + "</span><span class='colon'>:</span></span><span class='verse'>" + verse + "</span>";
    } else if (
        langAttribute &&
        langAttribute.telugu &&
        !langAttribute.english
    ) {
        return "<span class='hyphen'>-</span><span class='telugu-book'>" + tbd + "</span> <span class='chapter'><span class='chapter-number'>" + chapter + "</span><span class='colon'>:</span></span><span class='verse'>" + verse + "</span>";
    } else if (
        langAttribute &&
        !langAttribute.telugu &&
        langAttribute.english
    ) {
        return "<span class='hyphen'>-</span><span class='english-book'>" + bookf.label + "</span> <span class='chapter'><span class='chapter-number'>" + chapter + "</span><span class='colon'>:</span></span><span class='verse'>" + verse + "</span>";
    }

}

export function getVerce(bookf, chapter, verse) {
    let book = bookf.value;
    var tbd = ttb[book - 1].label;
    let e = bible.Book[book - 1].Chapter[chapter - 1].Verse[verse - 1].Verse;
    let t = tbible.Book[book - 1].Chapter[chapter - 1].Verse[verse - 1].Verse;
    let r = getRef(bookf, chapter, verse, tbd);
    let c = {e, t, r};

    let s;
    try {
        s = JSON.parse(localStorage.getItem("s"));
    } catch (error) {
        console.error("Error occurred while parsing localStorage:", error);
        // You can handle the error here, e.g., show an error message or take any other appropriate action
    }

    let langAttribute = {};
    if (s && s.lang) {
        try {
            langAttribute = s.lang;
        } catch (error) {
            console.error("Error occurred while parsing lang attribute:", error);
            // You can handle the error here, e.g., show an error message or take any other appropriate action
        }
    }

    // Check and modify lang attribute
    if (langAttribute && langAttribute.telugu && !langAttribute.english) {
        c.e = null;
    } else if (
        langAttribute &&
        !langAttribute.telugu &&
        langAttribute.english
    ) {
        c.t = null;
    }

    return c;
}
