import React, { useState } from "react";

const URLContext = React.createContext();

export const URLProvider = ({ children }) => {
  const url = "http://0571-81-215-238-236.ngrok.io";

  return <URLContext.Provider value={url}>{children}</URLContext.Provider>;
};

export default URLContext;
