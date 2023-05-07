import bible from "./data/bible.json";
import Button from "react-bootstrap/Button";
import Select from "react-dropdown-select";
import Fuse from "fuse.js"; // Import the fuse.js library
import sendLive, {
    bookState,
    chapterState,
    dynamicState,
    getLive,
    getVerce,
    historyState,
    prevState,
    verseState
} from "./recoilatoms";
import {useRecoilState, useSetRecoilState} from "recoil";
import {FormControl, InputGroup, ListGroup} from "react-bootstrap";
import {useEffect, useState} from "react";

export default function Bible() {
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
    }, {label: "1 Timothy", value: 54}, {label: "2 Timothy", value: 55}, {
        label: "Titus",
        value: 56
    }, {label: "Philemon", value: 57}, {label: "Hebrews", value: 58}, {label: "James", value: 59}, {
        label: "1 Peter",
        value: 60
    }, {label: "2 Peter", value: 61}, {label: "1 John", value: 62}, {label: "2 John", value: 63}, {
        label: "3 John",
        value: 64
    }, {label: "Jude", value: 65}, {label: "Revelation", value: 66},];
    const tb = [{label: "ఆదికాండము", value: 1}, {label: "నిర్గమకాండము", value: 2}, {
        label: "లేవీయకాండము",
        value: 3
    }, {label: "సంఖ్యాకాండము", value: 4}, {label: "ద్వితీయోపదేశకాండము", value: 5}, {
        label: "యెహోషువ",
        value: 6
    }, {label: "న్యాయాధిపతులు", value: 7}, {label: "రూతు", value: 8}, {
        label: "1 సమూయేలు",
        value: 9
    }, {label: "2 సమూయేలు", value: 10}, {label: "1 రాజులు", value: 11}, {
        label: "2 రాజులు",
        value: 12
    }, {label: "1 దినవృత్తాంతములు", value: 13}, {label: "2 దినవృత్తాంతములు", value: 14}, {
        label: "ఎజ్రా",
        value: 15
    }, {label: "నెహెమ్యా", value: 16}, {label: "ఎస్తేరు", value: 17}, {label: "యోబు", value: 18}, {
        label: "కీర్తనలు",
        value: 19
    }, {label: "సామెతలు", value: 20}, {label: "ప్రసంగి", value: 21}, {label: "పరమగీతము", value: 22}, {
        label: "యెషయా",
        value: 23
    }, {label: "యిర్మీయా", value: 24}, {label: "విలాపవాక్యములు", value: 25}, {
        label: "యెహెజ్కేలు",
        value: 26
    }, {label: "దానియేలు", value: 27}, {label: "హోషేయ", value: 28}, {label: "యోవేలు", value: 29}, {
        label: "ఆమోసు",
        value: 30
    }, {label: "ఓబద్యా", value: 31}, {label: "యోనా", value: 32}, {label: "మీకా", value: 33}, {
        label: "నహూము",
        value: 34
    }, {label: "హబక్కూకు", value: 35}, {label: "జెఫన్యా", value: 36}, {label: "హగ్గయి", value: 37}, {
        label: "జెకర్యా",
        value: 38
    }, {label: "మలాకీ", value: 39}, {label: "మత్తయి", value: 40}, {label: "మార్కు", value: 41}, {
        label: "లూకా",
        value: 42
    }, {label: "యోహాను", value: 43}, {label: "అపొస్తలుల కార్యములు", value: 44}, {
        label: "రోమా",
        value: 45
    }, {label: "1 కొరింథీయులకు", value: 46}, {label: "2 కొరింథీయులకు", value: 47}, {
        label: "గలతీయులకు",
        value: 48
    }, {label: "ఎఫెసీయులకు", value: 49}, {label: "ఫిలిప్పీయులకు", value: 50}, {
        label: "కొలొస్సయులకు",
        value: 51
    }, {label: "1 థెస్సలొనీకయులకు", value: 52}, {label: "2 థెస్సలొనీకయులకు", value: 53}, {
        label: "1 తిమోతికి",
        value: 54
    }, {label: "2 తిమోతికి", value: 55}, {label: "తీతుకు", value: 56}, {
        label: "ఫిలేమోనుకు",
        value: 57
    }, {label: "హెబ్రీయులకు", value: 58}, {label: "యాకోబు", value: 59}, {
        label: "1 పేతురు",
        value: 60
    }, {label: "2 పేతురు", value: 61}, {label: "1 యోహాను", value: 62}, {
        label: "2 యోహాను",
        value: 63
    }, {label: "3 యోహాను", value: 64}, {label: "యూదా", value: 65}, {label: "ప్రకటన", value: 66},];
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
    const [vsearchTerm, setVsearchTerm] = useState("");
    var bcv = new window.bcv_parser();
    const [book, setBook] = useRecoilState(bookState);
    const setPrev = useSetRecoilState(prevState);
    const [chapter, setChapter] = useRecoilState(chapterState);
    const [verse, setVerse] = useRecoilState(verseState);
    const [dynamic, setDynamic] = useRecoilState(dynamicState);
    var setHistory = useSetRecoilState(historyState)

    useEffect(() => {
        handleClickScroll(verse)
    }, [verse]);

    function handleVerseClick(verse) {
        const l = getVerce(verse.book, verse.chapter, verse.verse);
        if (book) {
            if (Array.isArray(book)) {
                if (book.length > 0) {
                    if (book[0].value !== verse.book.value) {
                        setBook([{label: verse.book.label, value: verse.book.value}]);
                    }
                } else {
                    setBook([{label: verse.book.label, value: verse.book.value}]);
                }
            } else {
                if (book.value !== verse.book.value) {
                    setBook([{label: verse.book.label, value: verse.book.value}]);
                }
            }
        }

        setChapter(verse.chapter);
        setVerse(verse.verse);
        setDynamic(`${verse.book.label} ${verse.chapter}:${verse.verse}`);
        setPrev(getLive(l));
        sendLive(getLive(l));
        setHistoryf(verse);
    }


    function handleClickScroll(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView(
                {
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center'
                }
            );
        }
    }


    function setPrevnes(verse) {
        const l = getVerce(verse.book, verse.chapter, verse.verse);
        setPrev(getLive(l));
        return "active";
    }

    function reloadh() {
        const history = localStorage.getItem("h");
        if (history) {
            setHistory(JSON.parse(history));
        } else {
            setHistory([]);
        }
    }

    function setHistoryf(obj) {
        const v = localStorage.getItem("h")
            ? JSON.parse(localStorage.getItem("h"))
            : [];
        localStorage.setItem("h", JSON.stringify([...v, obj]));
        reloadh();
    }

    return (
        <div className="bible-select-div center">
            <form
                style={{paddingLeft: 15, paddingRight: 15, marginTop: 28}}
                id="contact-form"
                className="contact-form"
                onSubmit={(e) => {
                    e.preventDefault();

                    if (book && verse && chapter) {
                        const selectedBook = Array.isArray(book) ? book[0] : book;
                        setDynamic(`${selectedBook.label} ${chapter}:${verse}`);
                        const obj = {
                            book: selectedBook,
                            chapter: chapter,
                            verse: verse,
                        };
                        try {
                            const l = getVerce(obj.book, obj.chapter, obj.verse);
                            let f = getLive(l);
                            setPrev(f);
                            sendLive(f);
                            setHistoryf(obj);
                        } catch (err) {
                            console.log(err)
                        }
                    }
                }}
            >
                <div className="mb-3">
                    <input
                        type="text"
                        value={dynamic}
                        placeholder={"Dynamic"}
                        onChange={(e) => {
                            const ver = e.target.value;
                            setDynamic(ver);
                            try {
                                const ref = bcv.parse(ver).entities[0].passages[0].start;
                                if (ref && ref.b) {
                                    const b = ref.b;
                                    const n = bibleBooks.find(
                                        (bo) => bo.osis.toLowerCase() === b.toLowerCase()
                                    );
                                    setBook(options[n.number - 1]);
                                    if (ref.c) {
                                        const c = ref.c;
                                        setChapter(c);
                                        if (ref.v) {
                                            const v = ref.v;
                                            setVerse(v);
                                        }
                                    }
                                }
                            } catch (err) {
                            }
                        }}
                        onKeyDown={(e) => {
                            let bookk;
                            if (e.key === "ArrowUp") {
                                if (book) {
                                    bookk = book;
                                    if (Array.isArray(book)) {
                                        bookk = book[0];
                                    }
                                    if (chapter) {
                                        if (verse) {
                                            setDynamic(
                                                `${bookk.label} ${chapter}:${parseInt(verse) + 1}`
                                            );
                                            setVerse((parseInt(verse) + 1).toString());
                                        }
                                    }
                                }
                            } else if (e.key === "ArrowDown") {
                                if (verse > 1) {
                                    if (book) {
                                        bookk = book;
                                        if (Array.isArray(book)) {
                                            bookk = book[0];
                                        }
                                        if (chapter) {
                                            if (verse) {
                                                setDynamic(
                                                    `${bookk.label} ${chapter}:${parseInt(verse) - 1}`
                                                );
                                                setVerse((parseInt(verse) - 1).toString());
                                                handleClickScroll(e.target.value.toString())

                                            }
                                        }
                                    }
                                }
                            }
                        }}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <Select
                        options={options}
                        onChange={(values) => {
                            setBook(values);
                        }}
                        values={Array.isArray(book) ? book : [book]}
                        clearable="true"
                        id="book"
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <input
                            type="number"
                            placeholder="chapter"
                            name="chapter"
                            min="1"
                            value={chapter}
                            onChange={(e) => {
                                setChapter(e.target.value);
                                setDynamic(
                                    `${Array.isArray(book) ? book[0].label : book.label} ${
                                        e.target.value
                                    }:${verse}`
                                );
                            }}
                            className="form-control"
                            id="chapter"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="number"
                            placeholder="verse"
                            name="verse"
                            min="1"
                            value={verse}
                            onChange={(e) => {
                                setVerse(e.target.value);
                                setDynamic(
                                    `${
                                        Array.isArray(book) ? book[0].label : book.label
                                    } ${chapter}:${e.target.value}`
                                );
                                handleClickScroll(e.target.value.toString())
                            }}
                            className="form-control"
                            id="verse"
                        />
                    </div>
                </div>
                <div className="cen">
                    <Button
                        type="submit"
                        variant="primary"
                        className="cen"
                        style={{width: "250px"}}
                    >
                        Go Live
                    </Button>
                </div>
            </form>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginRight: 30,
                    marginLeft: 30,
                    marginTop: 38,
                }}
            >
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search Verses in Chapter"
                        aria-label="Search Verses in Chapter"
                        aria-describedby="search-addon"
                        value={vsearchTerm}
                        onChange={(e) => setVsearchTerm(e.target.value)}
                    />
                </InputGroup>
            </div>

            <div
                style={{
                    overflowY: "auto",
                    maxHeight: `63vh`,
                    marginLeft: 15,
                    marginRight: 15,
                }}
            >
                <ListGroup>
                    {book &&
                        chapter &&
                        (Array.isArray(book) && book[0] && book[0].value
                                ? bible.Book[book[0].value - 1]
                                : bible.Book[book.value - 1]
                        )?.Chapter[chapter - 1] &&
                        (vsearchTerm
                                ? // Filter using fuzzy search
                                new Fuse(
                                    (Array.isArray(book) && book[0] && book[0].value
                                            ? bible.Book[book[0].value - 1]
                                            : bible.Book[book.value - 1]
                                    ).Chapter[chapter - 1].Verse,
                                    {
                                        keys: ["Verse"], // Specify the keys to search on
                                        threshold: 0.4, // Set the fuzzy search threshold (0.0 to 1.0)
                                    }
                                )
                                    .search(vsearchTerm)
                                    .map((result) => result.item)
                                : (Array.isArray(book) && book[0] && book[0].value
                                        ? bible.Book[book[0].value - 1]
                                        : bible.Book[book.value - 1]
                                ).Chapter[chapter - 1].Verse
                        ).map((Verse, index) => (
                            <ListGroup.Item
                                action
                                id={parseInt(
                                    Verse.Verseid.substring(Verse.Verseid.length - 3)
                                ) + 1}
                                onClick={() =>
                                    handleVerseClick({
                                        book: Array.isArray(book) ? book[0] : book,
                                        chapter: chapter,
                                        verse:
                                            parseInt(
                                                Verse.Verseid.substring(Verse.Verseid.length - 3)
                                            ) + 1,
                                    })
                                }

                                key={index}
                                className={
                                    verse &&
                                    parseInt(verse) ===
                                    parseInt(
                                        Verse.Verseid.substring(Verse.Verseid.length - 3)
                                    ) +
                                    1
                                        ? setPrevnes({
                                            book: Array.isArray(book) ? book[0] : book,
                                            chapter: chapter,
                                            verse:
                                                parseInt(
                                                    Verse.Verseid.substring(Verse.Verseid.length - 3)
                                                ) + 1,
                                        })
                                        : ""
                                }
                            >
                                <div>
                                    {parseInt(Verse.Verseid.substring(Verse.Verseid.length - 3)) +
                                        1}
                                    . {Verse.Verse}
                                </div>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            </div>
        </div>
    );
}
