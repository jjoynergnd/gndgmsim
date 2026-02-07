import React from "react";
import RosterList from "./roster/RosterList";

const RosterTable = ({ roster, onPlayerClick }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <RosterList roster={roster} onPlayerClick={onPlayerClick} />
    </div>
  );
};

export default RosterTable;
