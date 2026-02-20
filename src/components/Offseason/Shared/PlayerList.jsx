// src/components/offseason/Shared/PlayerList.jsx

import React, { useState, useMemo } from "react";
import PlayerRow from "./PlayerRow";

export default function PlayerList({
  players,
  suggestionsMap,
  onAction,
  year,
  cutOptions,
  restructureOptions,
  lastActionMap,
}) {
  const [sortKey, setSortKey] = useState("capHit");
  const [sortDir, setSortDir] = useState("desc");
  const [filterPos, setFilterPos] = useState("ALL");
  const [search, setSearch] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredSortedPlayers = useMemo(() => {
    let list = [...players];

    if (filterPos !== "ALL") {
      list = list.filter((p) => p.position === filterPos);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const aRatings = a.ratings || {};
      const bRatings = b.ratings || {};

      const aCap =
        a.contract?.capHits?.[year] || 0;
      const bCap =
        b.contract?.capHits?.[year] || 0;

      const aOvr = aRatings.overall || 0;
      const bOvr = bRatings.overall || 0;

      const aAge = a.vitals?.age || 0;
      const bAge = b.vitals?.age || 0;

      const getRemaining = (p) =>
        Object.keys(p.contract?.capHits || {}).filter(
          (y) => parseInt(y, 10) >= year
        ).length;

      let aVal = 0;
      let bVal = 0;

      switch (sortKey) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "pos":
          aVal = a.position || "";
          bVal = b.position || "";
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "age":
          aVal = aAge;
          bVal = bAge;
          break;
        case "ovr":
          aVal = aOvr;
          bVal = bOvr;
          break;
        case "remaining":
          aVal = getRemaining(a);
          bVal = getRemaining(b);
          break;
        case "capHit":
        default:
          aVal = aCap;
          bVal = bCap;
          break;
      }

      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [players, filterPos, search, sortKey, sortDir, year]);

  const positions = Array.from(
    new Set(players.map((p) => p.position))
  ).sort();

  return (
    <div style={styles.card}>
      <div style={styles.headerBar}>
        <h3 style={styles.title}>Players Under Contract</h3>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
          <select
            value={filterPos}
            onChange={(e) => setFilterPos(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">All Pos</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.stickyHeader}>
        <div style={styles.tableHeader}>
          <span style={styles.colActions}>Actions</span>
          <span
            style={styles.colCenterClickable}
            onClick={() => handleSort("ovr")}
          >
            OVR
          </span>
          <span
            style={styles.colNameClickable}
            onClick={() => handleSort("name")}
          >
            Name
          </span>
          <span
            style={styles.colCenterClickable}
            onClick={() => handleSort("pos")}
          >
            Pos
          </span>
          <span
            style={styles.colCenterClickable}
            onClick={() => handleSort("age")}
          >
            Age
          </span>
          <span
            style={styles.colCenterClickable}
            onClick={() => handleSort("remaining")}
          >
            Remaining
          </span>
          <span
            style={styles.colCenterClickable}
            onClick={() => handleSort("capHit")}
          >
            Cap Hit
          </span>
          <span style={styles.colCenter}>Dead $</span>
          <span style={styles.colCenter}>Save</span>
          <span style={styles.colCenter}>Restruct</span>
        </div>
      </div>

      <div style={styles.scrollArea}>
        {filteredSortedPlayers.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            suggestion={suggestionsMap[p.id]}
            onAction={onAction}
            year={year}
            cutOptions={cutOptions?.[p.id]}
            restructureOptions={restructureOptions?.[p.id]}
            lastAction={lastActionMap?.[p.id]}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  headerBar: {
    padding: "10px 20px 6px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  search: {
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    fontSize: 12,
  },
  select: {
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    fontSize: 12,
    backgroundColor: "#F9FAFB",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#F1FBFA",
    borderTop: "1px solid #E5E7EB",
    borderBottom: "1px solid #DDEEEE",
    padding: "4px 20px 4px 20px",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "0.9fr 0.7fr 2fr 0.7fr 0.7fr 0.9fr 1fr 1fr 1fr 1fr",
    fontSize: 13,
    color: "#0F4C5C",
    fontWeight: 700,
    alignItems: "center",
  },
  colNameClickable: {
    paddingLeft: 4,
    textAlign: "left",
    borderRight: "1px solid #E3F0EF",
    cursor: "pointer",
  },
  colActions: {
    textAlign: "left",
    paddingLeft: 4,
    borderRight: "1px solid #E3F0EF",
  },
  colCenter: {
    textAlign: "center",
    borderRight: "1px solid #E3F0EF",
  },
  colCenterClickable: {
    textAlign: "center",
    borderRight: "1px solid #E3F0EF",
    cursor: "pointer",
  },
  scrollArea: {
    maxHeight: "70vh",
    overflowY: "auto",
  },
};
