import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import GrassIcon from "@mui/icons-material/Grass";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterIcon from "@mui/icons-material/Water";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Gauge } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { mangoFusionPalette } from "@mui/x-charts/colorPalettes";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";

function HeatCool() {
  const [ClockOutput, setClockOutput] = useState("");
  const [TempCOutput, setTempCOutput] = useState("");
  const [TempFOutput, setTempFOutput] = useState("");
  const [TempKOutput, setTempKOutput] = useState("");
  const [HumidityOutput, setHumidityOutput] = useState(0);
  const [FonbuttonColor, setFonButtonColor] = useState("black");
  const [FoffbuttonColor, setFoffButtonColor] = useState("black");
  const [open, setOpen] = useState(false);
  const [Tempcdata, setTempcData] = useState([]);
  const [Tempfdata, setTempfData] = useState([]);
  const [Tempkdata, setTempkData] = useState([]);
  const [Humdata, setHumData] = useState([]);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const itemsList = [
    {
      text: "Home",
      icon: <GrassIcon />,
      onClick: () => navigate("/Home"),
    },
    {
      text: "Heating/Cooling",
      icon: <ThermostatIcon />,
      // onClick: () => navigate("/HeatCool"),
    },
    {
      text: "Watering",
      icon: <WaterIcon />,
      onClick: () => navigate("/Watering"),
    },
    {
      text: "User Controls",
      icon: <LightbulbIcon />,
      onClick: () => navigate("/AllButtons"),
    },
  ];

  const DrawerList = (
    <Box className="Menu" role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {itemsList.map(({ text, icon, onClick }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText primary={text} onClick={onClick} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const handleDataBuffer = (value, array, setArray) => {
    if (array?.length < 10) {
      array.push(value);
    } else {
      array.splice(0, 1);
      array.push(value);
    }
    setArray(array);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:5000/clock").then((res) => {
        console.log(res.data);
        setClockOutput(res.data);
      });
      axios.get("http://localhost:5000/dht22/tempC").then((res) => {
        console.log(res.data);
        setTempCOutput(res.data);
        handleDataBuffer(res.data.temp, Tempcdata, setTempcData);
        // setTempcData((prev) => [...prev, res.data.temp]);
      });
      axios.get("http://localhost:5000/dht22/tempF").then((res) => {
        console.log(res.data);
        setTempFOutput(res.data);
        handleDataBuffer(res.data.temp, Tempfdata, setTempfData);
        // setTempfData((prev) => [...prev, res.data.temp]);
      });
      axios.get("http://localhost:5000/dht22/tempK").then((res) => {
        console.log(res.data);
        setTempKOutput(res.data);
        setTempkData((prev) => [...prev, res.data.temp]);
      });
      axios.get("http://localhost:5000/dht22/humidity").then((res) => {
        console.log(res.data);
        setHumidityOutput(res.data);
        handleDataBuffer(res.data.humidity, Humdata, setHumData);
        // setHumData((prev) => [...prev, res.data.humidity]);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const Fanon = () => {
    axios.get("http://localhost:5000/start/fan").then((res) => {
      setFonButtonColor("green");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setFonButtonColor("black");
    }, 1000);
  };

  const Fanoff = () => {
    axios.get("http://localhost:5000/stop/fan").then((res) => {
      setFoffButtonColor("red");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setFoffButtonColor("black");
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Button onClick={toggleDrawer(true)}>
            <MenuIcon fontSize="large" />
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>
        <h1>
          <GrassIcon fontSize="large" />
          <Link
            className="Link"
            underline="hover"
            href="https://github.com/maxim006/Trideum-smart-garden"
          >
            Mars Automated Plant System
          </Link>
          <GrassIcon fontSize="large" />
          Heating & Cooling
          <GrassIcon fontSize="large" />
        </h1>
        <h2>Created by Maxim Sadriyev and Brianna Rey</h2>
        <h3>{ClockOutput?.time}</h3>
        <ul></ul>
        <div className="Sensorwrapper">
          <div className="TempC">Temperature: {TempCOutput?.temp}C</div>
          <div className="TempF">Temperature: {TempFOutput?.temp}F</div>
          <div className="TempK">Temperature: {TempKOutput?.temp}K</div>
          <div className="Humidity">
            Humidity %:
            <Gauge
              width={100}
              height={100}
              value={parseFloat(HumidityOutput?.humidity) || 0}
            />
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
        </div>
        <div className="Charts">
          <LineChart
            xAxis={[
              {
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              },
            ]}
            series={[
              {
                data: Humdata,
                label: "Humidity",
              },
              {
                data: Tempcdata,
                label: "Temperature(C)",
              },
              {
                data: Tempfdata,
                label: "Temperature(F)",
              },
            ]}
            colors={mangoFusionPalette}
            width={750}
            height={400}
            grid={{ horizontal: true }}
          />
          <BarChart
            xAxis={[
              {
                id: "barCategories",
                data: ["Temp(C)", "Temp(F)", "Humidity"],
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: [Tempcdata, Tempfdata, Humdata],
                color: ["#f8d49b"],
              },
            ]}
            width={750}
            height={400}
            grid={{ horizontal: true }}
          />
        </div>
      </header>
    </div>
  );
}

export default HeatCool;
