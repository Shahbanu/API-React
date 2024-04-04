import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import Table from "./Component/Table";
import View from "./Component/View";
import Order from "./Component/Order";

function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/table" element={<Table />} />
        <Route path="/view/:id" element={<View />} />
        <Route path="/Order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
