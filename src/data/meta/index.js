// src/data/meta/index.js

/**
 * Auto-exports all meta JSON files in this folder.
 */

const context = import.meta.glob("./*.json", { eager: true });

const metas = {};

for (const path in context) {
  const fileName = path.split("/").pop().replace(".json", "");
  metas[fileName] = context[path].default;
}

export default metas;
