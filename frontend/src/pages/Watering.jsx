import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import Box from "@mui/material/Box";
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

function Watering() {
  const [ClockOutput, setClockOutput] = useState("");
  const [TempCOutput, setTempCOutput] = useState("");
  const [TempFOutput, setTempFOutput] = useState("");
  const [TempKOutput, setTempKOutput] = useState("");
  const [HumidityOutput, setHumidityOutput] = useState(0);
  const [MoistureOutput, setMoistureOutput] = useState(0);
  const [WonbuttonColor, setWonButtonColor] = useState("black");
  const [WoffbuttonColor, setWoffButtonColor] = useState("black");
  const [open, setOpen] = useState(false);
  const [Moistdata, setMoistData] = useState([]);
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
      onClick: () => navigate("/HeatCool"),
    },
    {
      text: "Watering",
      icon: <WaterIcon />,
      // onClick: () => navigate("/Watering"),
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
      axios.get("http://localhost:5000/sensor/Moisture").then((res) => {
        console.log(res.data);
        setMoistureOutput(res.data);
        handleDataBuffer(res.data.Moisture, Moistdata, setMoistData);
        // setMoistData((prev) => [...prev, res.data.Moisture]);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const Wateron = () => {
    axios.get("http://localhost:5000/wateron").then((res) => {
      setWonButtonColor("green");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setWonButtonColor("black");
    }, 10000);
  };

  const Wateroff = () => {
    axios.get("http://localhost:5000/wateroff").then((res) => {
      setWoffButtonColor("red");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setWoffButtonColor("black");
    }, 10000);
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
          Mars Automated Plant System
          <GrassIcon fontSize="large" />
          Moisture & Watering
          <GrassIcon fontSize="large" />
        </h1>
        <h2>Created by Maxim Sadriyev and Brianna Rey</h2>
        <h3>{ClockOutput?.time}</h3>
        <ul></ul>
        <div className="Sensorwrapper">
          <div className="Moisture">
            Moisture %:
            <Gauge
              width={100}
              height={100}
              value={parseFloat(MoistureOutput?.Moisture) || 0}
            />
          </div>
        </div>
        <ul></ul>
        <div className="Buttonwrapper">
          <button
            className="Wateron"
            style={{ backgroundColor: WonbuttonColor }}
            onClick={Wateron}
          >
            Water ON
          </button>
          <button
            className="Wateroff"
            style={{ backgroundColor: WoffbuttonColor }}
            onClick={Wateroff}
          >
            Water OFF
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
                data: Moistdata,
                label: "Moisture",
              },
            ]}
            colors={mangoFusionPalette}
            width={750}
            height={400}
            grid={{ horizontal: true }}
          />
          {/* <BarChart
            xAxis={[
              {
                id: "barCategories",
                data: ["Moisture"],
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: [Moistdata],
                color: ["#f8d49b"],
              },
            ]}
            width={750}
            height={400}
            grid={{ horizontal: true }}
          /> */}
        </div>
      </header>
    </div>
  );
}

export default Watering;
