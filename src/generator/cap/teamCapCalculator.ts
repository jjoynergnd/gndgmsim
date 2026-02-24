// src/generator/cap/teamCapCalculator.ts

// Team-level cap helpers, now year-aware and backwards-compatible.

export function getTeamTotalSalary(roster: any[], year: number): number {
  // --- DEBUG: confirm which file is executing + what data it sees ---
  console.log("DEBUG CAP CALCULATOR FILE:", import.meta.url);
  console.log("DEBUG CAP CALCULATOR INPUT YEAR:", year);
  console.log("DEBUG CAP CALCULATOR FIRST CONTRACT:", roster[0]?.contract);
  // ------------------------------------------------------------------

  return roster.reduce((sum, p) => {
    const contract = p.contract;
    if (!contract) return sum;

    // New multi-year shape
    if (contract.yearBreakdown && Array.isArray(contract.yearBreakdown)) {
      const entry = contract.yearBreakdown.find((y: any) => y.year === year);

      if (entry) {
        const value = entry.capHit ?? entry.salary ?? 0;

        // 🔥 DEBUG: catch NaN immediately
        if (Number.isNaN(value)) {
          console.log("❌ NaN DETECTED:", {
            playerId: p.id,
            position: p.position,
            year,
            entry,
            contract
          });
        }

        return sum + value;
      }

      return sum;
    }


    // Backwards compatibility: old single-year { salary } shape
    if (typeof contract.salary === "number") {
      return sum + contract.salary;
    }

    return sum;
  }, 0);
}

export function getTeamCapSpace(totalSalary: number, leagueCap: number): number {
  return leagueCap - totalSalary;
}
