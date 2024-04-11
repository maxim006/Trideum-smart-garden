import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Gauge } from "@mui/x-charts/Gauge";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
// import ThermostatIcon from "@mui/icons-material/Thermostat";
// import WaterDropIcon from "@mui/icons-material/WaterDrop";
// import CloudIcon from "@mui/icons-material/Cloud";
// import YardRounded from "@mui/icons-material/YardRounded";

function App() {
  const [ClockOutput, setClockOutput] = useState("");
  const [TempCOutput, setTempCOutput] = useState("");
  const [TempFOutput, setTempFOutput] = useState("");
  const [HumidityOutput, setHumidityOutput] = useState("");
  const [MoistureOutput, setMoistureOutput] = useState("");
  const [LonbuttonColor, setLonButtonColor] = useState("black");
  const [WonbuttonColor, setWonButtonColor] = useState("black");
  const [FonbuttonColor, setFonButtonColor] = useState("black");
  const [LopenbuttonColor, setLopenButtonColor] = useState("black");
  const [LclosebuttonColor, setLcloseButtonColor] = useState("black");
  const [FoffbuttonColor, setFoffButtonColor] = useState("black");
  const [LoffbuttonColor, setLoffButtonColor] = useState("black");
  const [WoffbuttonColor, setWoffButtonColor] = useState("black");
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box className="Menu" role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Temperature", "Humidity", "Moisture", "Sensors"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:5000/clock").then((res) => {
        console.log(res.data);
        setClockOutput(res.data);
      });
      axios.get("http://localhost:5000/dht22/tempC").then((res) => {
        console.log(res.data);
        setTempCOutput(res.data);
      });
      axios.get("http://localhost:5000/dht22/tempF").then((res) => {
        console.log(res.data);
        setTempFOutput(res.data);
      });
      axios.get("http://localhost:5000/dht22/humidity").then((res) => {
        console.log(res.data);
        setHumidityOutput(res.data);
      });
      axios.get("http://localhost:5000/sensor/Moisture").then((res) => {
        console.log(res.data);
        setMoistureOutput(res.data);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const Wateron = () => {
    axios.get("http://localhost:5000/start/watering").then((res) => {
      setWonButtonColor("green");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setWonButtonColor("black");
    }, 10000);
  };

  // const Wateroff = () => {
  //   axios.get("http://localhost:5000/start/watering").then((res) => {
  //     setWonButtonColor("green");
  //     console.log;
  //   });

  //   setTimeout(() => {
  //     console.log("Turning button black");
  //     setWonButtonColor("black");
  //   }, 10000);
  // };

  const Fanon = () => {
    axios.get("http://localhost:5000/start/fan").then((res) => {
      setFonButtonColor("green");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setFonButtonColor("black");
    }, 10000);
  };

  const Fanoff = () => {
    axios.get("http://localhost:5000/stop/fan").then((res) => {
      setFonButtonColor("red");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setFonButtonColor("black");
    }, 10000);
  };

  const lightsOn = () => {
    axios.get("http://localhost:5000/lighton").then((res) => {
      setLonButtonColor("green");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLonButtonColor("black");
    }, 1000);
  };

  const lightsOff = () => {
    axios.get("http://localhost:5000/lightoff").then((res) => {
      setLoffButtonColor("red");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLoffButtonColor("black");
    }, 1000);
  };

  const lidOpen = () => {
    axios.get("http://localhost:5000/openlid").then((res) => {
      setLopenButtonColor("green");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLopenButtonColor("black");
    }, 1000);
  };

  const lidClose = () => {
    axios.get("http://localhost:5000/closelid").then((res) => {
      setLcloseButtonColor("red");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLcloseButtonColor("black");
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Button onClick={toggleDrawer(true)}>
            <MenuIcon />
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>
        <h1>Trideum Smart Garden</h1>
        <h2>Created by Maxim Sadriyev and Brianna Rey</h2>
        <div className="Clock">{ClockOutput?.time}</div>
        <ul></ul>
        <div className="Sensorwrapper">
          <div className="TempC">Temperature: {TempCOutput?.temp}C</div>
          <div className="TempF">Temperature: {TempFOutput?.temp}F</div>
          <div className="Humidity">
            Humidity %:
            <Gauge width={100} height={100} value={HumidityOutput?.humidity} />
          </div>
          <div className="Moisture">
            Moisture %:
            <Gauge width={100} height={100} value={MoistureOutput?.Moisture} />
          </div>
        </div>
        <ul></ul>
        <div className="Buttonwrapper">
          <button
            className="Fanon"
            style={{ backgroundColor: FonbuttonColor }}
            onClick={Fanon}
          >
            Fan ON
          </button>
          <button
            className="Fanoff"
            style={{ backgroundColor: FoffbuttonColor }}
            onClick={Fanoff}
          >
            Fan OFF
          </button>
          <button
            className="Lighton"
            style={{ backgroundColor: LonbuttonColor }}
            onClick={lightsOn}
          >
            Lights ON
          </button>
          <button
            className="Lightoff"
            style={{ backgroundColor: LoffbuttonColor }}
            onClick={lightsOff}
          >
            Lights OFF
          </button>
          <button
            className="Lidopen"
            style={{ backgroundColor: LopenbuttonColor }}
            onClick={lidOpen}
          >
            Lid OPEN
          </button>
          <button
            className="Lidclose"
            style={{ backgroundColor: LclosebuttonColor }}
            onClick={lidClose}
          >
            Lid CLOSE
          </button>
          <button
            className="Wateron"
            style={{ backgroundColor: WonbuttonColor }}
            onClick={Wateron}
          >
            Water ON
          </button>
          <button
            disabled
            className="Wateroff"
            style={{ backgroundColor: WoffbuttonColor }}
            onClick={Wateron}
          >
            Water OFF
          </button>
        </div>
        {/* <LineChart
          className="Moistchart"
          xAxis={[{ data: [ClockOutput] }]}
          series={[
            {
              data: [MoistureOutput],
            },
          ]}
          width={500}
          height={300}
        /> */}
      </header>
    </div>
  );
}

export default App;
