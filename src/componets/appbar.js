import React, {useState} from "react";
import {Button, Container, Navbar} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css"; // ES6
import sendLive, {prevState} from "./recoilatoms";
import {useSetRecoilState} from "recoil";

export default function Appbar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var [t, setT] = useState();
  const setPrev = useSetRecoilState(prevState);
  const openWindow = () => {
    window.open("/live", "live", "fullscreen=yes");
  };

  function Qs(t) {
    setPrev(t);
    sendLive(t);
    handleClose();
  }

  return (
      <React.Fragment>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quick Send</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReactQuill onChange={(values) => setT(values)} theme="bubble"/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => Qs(t)}>
              Quick Send
            </Button>
          </Modal.Footer>
        </Modal>

        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Church Presentation Software</Navbar.Brand>
            <Container>
              <div>
                <Button
                    className="cen"
                    variant={"warning"}
                    onClick={() => sendLive("")}
                >
                  Clear Screen
                </Button>
                <Button
                    className="cen btn-mar"
                    variant={"secondary"}
                    onClick={handleShow}
                >
                  {" "}
                  Quick Send
                </Button>
                <Button
                    onClick={openWindow}
                    variant="primary"
                    className="cen btn-mar"
                >
                  Open Live
                </Button>
              </div>
            </Container>
          </Container>
        </Navbar>
      </React.Fragment>
  );
}
