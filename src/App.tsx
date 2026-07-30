import React from "react";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <React.Fragment>
      <Dashboard />
      <Toaster />
    </React.Fragment>
  );
}

export default App;
