/*global chrome*/
import { useEffect, useState } from "react";

import Counter from "./component/Counter";
import Spinnner from "./component/spinner/Spinner";
// icons
import { RiComputerLine } from "react-icons/ri";
import { GoLocation } from "react-icons/go";
import { VscOrganization } from "react-icons/vsc";
import { BsFillFlagFill } from "react-icons/bs";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState({});
  const [counter, setCounter] = useState(0);
  const [loading, setLoding] = useState(true);
  const [icons, setIcons] = useState([RiComputerLine, GoLocation]);

  //
  useEffect(() => {
    const fetchData = async () => {
      const domain = await getCurrentTab();
      const apiData = await getApiArpeely(domain);

      setLoding(false);
      // save data for show in state
      setActiveTab({
        ip: apiData.ip,
        location: apiData.location,
        organization: apiData.organization.split(" ")[1],
        country_code: apiData.country_code,
      });
      saveDomain(domain);
    };
    fetchData();
  }, []);

  // use arpeely api with the domain website
  const getApiArpeely = async (domain) => {
    try {
      const response = await fetch(
        `https://hw.arpeely.ai/domain/info?domain=${domain}`,
        {
          method: "GET",
          headers: {
            "X-Best-Pokemon": "Pikachu",
          },
        }
      );
      const body = await response.json();
      console.log(body);
      return body;
    } catch (err) {
      throw new Error(err);
    }
  };

  // Similar to window locatin => use the url of current tab
  const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab);
    return tab.url.split("/")[2];
  };

  // Similar to local storage => Save history for the counter
  const saveDomain = (domain) => {
    // initialState to storage
    let objData = {
      counter: 0,
      domain: [],
    };

    chrome.storage.sync.get(["key"], function (result) {
      if (result.key) {
        objData = JSON.parse(result.key);
      }
      if (!objData.domain.includes(domain)) {
        objData.counter++;
        objData.domain.push(domain);
        const value = JSON.stringify(objData);
        chrome.storage.sync.set({ key: value }, function () {
          console.log("Value is set to ", value);
        });
      }
      setCounter(objData.counter);
      setLoding(false);
    });
  };

  const resetCounter = () => {
    setCounter(0);

    let objData = {
      counter: 0,
      domain: [],
    };
    const value = JSON.stringify(objData);

    chrome.storage.sync.set({ key: value }, function () {
      console.log("Value is set to ", value);
    });
  };

  // go to arpeely web
  const openTab = () => {
    window.open("https://www.arpeely.com/", "_blank");
  };

  return (
    <div className='container'>
      {loading && <Spinnner />}

      <button className='web-btn' onClick={() => openTab()}>
        A
      </button>
      <h4 className='show'>Arpeely Chrome Extension</h4>

      <div className='content'>
        <div className='column'>
          <div className='icons'>
            <RiComputerLine className='icons' /> {activeTab.ip}
          </div>
          <div className='icons'>
            <GoLocation className='icons' /> {activeTab.location}
          </div>
          <div className='icons'>
            <VscOrganization className='icons' />
            {activeTab.organization}
          </div>
          <div className='icons'>
            <BsFillFlagFill className='icons' />
            {activeTab.country_code}
          </div>

          <div className='count-div'>
            {!loading && <Counter counter={counter} />}
            <button className='btn reset-btn' onClick={resetCounter}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* <div className='flap'></div> */}
    </div>
  );
}

export default App;
