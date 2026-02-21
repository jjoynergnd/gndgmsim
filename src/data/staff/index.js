// src/data/staff/index.js

/**
 * Auto-exports all staff JSON files in this folder.
 */

const context = import.meta.glob("./*.json", { eager: true });

const staffs = {};

for (const path in context) {
  const fileName = path.split("/").pop().replace(".json", "");
  staffs[fileName] = context[path].default;
}

export default staffs;
