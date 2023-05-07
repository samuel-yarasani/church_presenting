import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {Col, Row} from "react-bootstrap";

const Set = () => {
  const [f, setF] = useState("");
  const [languages, setLanguages] = useState({
    telugu: false,
    english: false,
  });

  useEffect(() => {
    const storedData = localStorage.getItem("s");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const {tc, ws, cs, lang, bi} = parsedData;
      setLanguages(lang);
      setF(bi);
      document.getElementsByName("ws")[0].value = ws;
      document.getElementsByName("cs")[0].value = cs;
      document.getElementsByName("color")[0].value = tc;
    }
  }, []);

  const handleChange = (e) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        console.log("e.target.result", e.target.result);
        setF(e.target.result);
      };
    } catch (e) {
      console.log(e);
    }

  };

  function settingsHandleSubmit(event) {
    event.preventDefault();
    let tc = event.currentTarget.elements.color.value;
    let ws = event.currentTarget.elements.ws.value;
    let bi = f;
    let lang = languages;
    let l = {
      tc: tc,
      bi: bi,
      ws: ws,
      lang: lang,
    };
    localStorage.setItem("s", JSON.stringify(l));
    new BroadcastChannel("mc").postMessage(1);
  }

  const handleLanguageChange = (language) => {
    setLanguages((prevLanguages) => ({
      ...prevLanguages,
      [language]: !prevLanguages[language],
    }));
  };

  return (
      <div className="container">
        <Form onSubmit={settingsHandleSubmit}>
          <Row>
            <Form.Group as={Col} controlId="backgroundImage">
              <Form.Label>Background Image:</Form.Label>
              <InputGroup>
                <Form.Control type="file" accept="image/*" onChange={handleChange}/>
                <Button variant="danger" onClick={() => {
                  setF("");
                }}>
                  Delete
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId="textColor">
              <Form.Label>Text Color:</Form.Label>
              <Form.Control type="color" name="color"/>
            </Form.Group>
          </Row>
          <br/>
          <Row>
            <Form.Group as={Col} controlId="obsWebsocketUrl">
              <Form.Label>OBS Websocket url:</Form.Label>
              <Form.Control type="text" name="ws"/>
            </Form.Group>
            <Form.Group as={Col} controlId="language">
              <Form.Label>Language:</Form.Label>
              <Form.Check
                  type="checkbox"
                  label="Telugu"
                  checked={languages.telugu}
                  onChange={() => handleLanguageChange("telugu")}
              />
              <Form.Check
                  type="checkbox"
                  label="English"
                  checked={languages.english}
                  onChange={() => handleLanguageChange("english")}
              />
            </Form.Group>
          </Row>
          <br/>
          <Form.Group controlId="customCss">
            <Form.Label>Custom CSS:</Form.Label>
            <Form.Control as="textarea" cols="40" rows="5" name="cs"/>
          </Form.Group>
          <br/>
          <div className={"cen"}>
            <Button type="submit" variant="primary">
              Save
            </Button>
            {/* remove background image button */}

          </div>
        </Form>
      </div>
  );
};
export default Set;
