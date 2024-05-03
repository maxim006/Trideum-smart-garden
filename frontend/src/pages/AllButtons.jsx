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
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";

function AllButtons() {
  const [ClockOutput, setClockOutput] = useState("");

  const [LonbuttonColor, setLonButtonColor] = useState("black");
  const [WonbuttonColor, setWonButtonColor] = useState("black");
  const [FonbuttonColor, setFonButtonColor] = useState("black");
  const [LopenbuttonColor, setLopenButtonColor] = useState("black");
  const [LclosebuttonColor, setLcloseButtonColor] = useState("black");
  const [FoffbuttonColor, setFoffButtonColor] = useState("black");
  const [LoffbuttonColor, setLoffButtonColor] = useState("black");
  const [WoffbuttonColor, setWoffButtonColor] = useState("black");
  const [open, setOpen] = useState(false);
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
      onClick: () => navigate("/Watering"),
    },
    {
      text: "User Controls",
      icon: <LightbulbIcon />,
      // onClick: () => navigate("/AllButtons"),
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

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:5000/clock").then((res) => {
        console.log(res.data);
        setClockOutput(res.data);
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

  const lightsOn = () => {
    axios.get("http://localhost:5000/lighton").then((res) => {
      setLonButtonColor("green");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLonButtonColor("black");
    }, 1000);
  };

  const lightsOff = () => {
    axios.get("http://localhost:5000/lightoff").then((res) => {
      setLoffButtonColor("red");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLoffButtonColor("black");
    }, 1000);
  };

  const lidOpen = () => {
    axios.get("http://localhost:5000/openlid").then((res) => {
      setLopenButtonColor("green");
    });

    setTimeout(() => {
      console.log("Turning button black");
      setLopenButtonColor("black");
    }, 1000);
  };

  const lidClose = () => {
    axios.get("http://localhost:5000/closelid").then((res) => {
      setLcloseButtonColor("red");
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
          User Controls
          <GrassIcon fontSize="large" />
        </h1>
        <h2>Created by Maxim Sadriyev and Brianna Rey</h2>
        <h3>{ClockOutput?.time}</h3>
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
            className="Wateroff"
            style={{ backgroundColor: WoffbuttonColor }}
            onClick={Wateroff}
          >
            Water OFF
          </button>
        </div>
      </header>
    </div>
  );
}

export default AllButtons;
