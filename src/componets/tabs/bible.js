import {Button, FormControl, InputGroup, ListGroup} from "react-bootstrap";
import {useRecoilState, useSetRecoilState} from "recoil";
import sendLive, {bookState, chapterState, dynamicState, historyState, prevState, verseState} from "../recoilatoms";
import {useState} from "react";
import {getLive, getVerce} from ".././recoilatoms"

export default function Biblee() {
    var [history, setHistory] = useRecoilState(historyState)
    const [book, setBook] = useRecoilState(bookState);
    const setPrev = useSetRecoilState(prevState);
    const setChapter = useSetRecoilState(chapterState);
    const setVerse = useSetRecoilState(verseState);
    const setDynamic = useSetRecoilState(dynamicState);
    const [searchTerm, setSearchTerm] = useState("");

    function getPreviw(l) {
        l.r = l.r.replace(/<[^>]*>?/gm, '');
        return l.e + " " + l.t + " " + l.r;
    }

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
    }


    function reloadh() {
        const history = localStorage.getItem("h");
        if (history) {
            setHistory(JSON.parse(history));
        } else {
            setHistory([]);
        }
    }

    return <>
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginRight: 30,
                marginLeft: 30,
                marginTop: 38,
            }}
        >
            <div className="d-flex">
                <InputGroup className="mr-2">
                    <FormControl
                        placeholder="Search Verses in Chapter"
                        aria-label="Search Verses in Chapter"
                        aria-describedby="search-addon"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
                <Button
                    variant={"warning"}
                    onClick={() => {
                        localStorage.removeItem("h");
                        reloadh();
                    }}
                    className={"btn-mar"}
                >
                    Clear
                </Button>
            </div>


        </div>
        <div
            style={{
                overflowY: "auto",
                maxHeight: `39vh`,
                marginLeft: 15,
                marginRight: 15,
                marginTop: 28,
            }}
        >
            <ListGroup>
                {(!searchTerm ? history : history.filter((verse) => {
                        const preview = getPreviw(
                            getVerce(verse.book, verse.chapter, verse.verse)
                        ).toLowerCase();
                        const searchWords = searchTerm.toLowerCase().split(" ");
                        return searchWords.every((word) => preview.includes(word));
                    })
                ).map((verse, index) => (
                    <ListGroup.Item
                        action
                        onClick={() => handleVerseClick(verse)}
                        key={index}
                    >
                        {getPreviw(getVerce(verse.book, verse.chapter, verse.verse))}
                    </ListGroup.Item>
                ))}
            </ListGroup></div>

    </>;
}