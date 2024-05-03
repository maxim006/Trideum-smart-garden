import Home from "./Home";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import HeatCool from "./pages/HeatCool";
import Watering from "./pages/Watering";
import AllButtons from "./pages/AllButtons";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/Home" exact element={<Home />}></Route>
          <Route path="/HeatCool" exact element={<HeatCool />}></Route>
          <Route path="/Watering" exact element={<Watering />}></Route>
          <Route path="/AllButtons" exact element={<AllButtons />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
