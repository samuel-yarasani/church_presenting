import "./App.css";
import Appbar from "./componets/appbar";
import Bible from "./componets/bible";
import Pre from "./componets/pre";
import Livepre from "./componets/Livepre";
import TabsPage from "./componets/tabs";
import {RecoilRoot} from "recoil";

function App() {
  return (
      <div className="App">
        <RecoilRoot>
          <Appbar/>
          <div className="layout">
            <div className="bible">
              <Bible/>
            </div>
            <div className="pre">
              <Pre/>
            </div>
            <div className="live">
              <Livepre/>
            </div>
            <div className="tabs">
              <TabsPage/>
            </div>
          </div>
        </RecoilRoot>
      </div>
  );
}

export default App;
