import React from "react";

const RosterTable = ({ roster }) => {
  return (
    <div>
      <h3>Roster</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
            <th>Name</th>
            <th>Pos</th>
            <th>OVR</th>
            <th>Age</th>
            <th>Contract</th>
          </tr>
        </thead>

        <tbody>
          {roster.map((p) => (
            <tr
              key={p.id}
              style={{ borderBottom: "1px solid #eee", height: "40px" }}
            >
              <td>{p.name}</td>
              <td>{p.position}</td>
              <td>{p.overall}</td>
              <td>{p.age}</td>
              <td>{p.contract}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RosterTable;
