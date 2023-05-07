import {Tab, Tabs} from "react-bootstrap";
import Set from "../settings";
import Custom from "./custom";
import Biblee from "./bible";


export default function TabsPage() {
    return (
        <div>
            <br></br>
            <Tabs
                defaultActiveKey="bible"
                className="mb-3"
                style={{justifyContent: "center"}}
            >
                <Tab eventKey="bible" title="Bible">
                    <Biblee></Biblee>
                </Tab>
                <Tab eventKey="custom" title="Custom">
                    <Custom></Custom>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <Set></Set>
                </Tab>
            </Tabs>{" "}
        </div>
    );
}
