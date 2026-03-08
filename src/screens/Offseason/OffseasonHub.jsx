import { loadFranchise } from "../../franchise/loadFranchise";

export default function OffseasonHub() {
  const franchise = loadFranchise();

  if (!franchise) {
    return <div>No franchise loaded.</div>;
  }

  const phase = franchise.league.offseason.phase;

  return (
    <div>
      <h1>Offseason Phase {phase}</h1>

      {phase === 1 && <div>Staff Updates Screen</div>}
      {phase === 2 && <div>Roster Management Screen</div>}
      {phase === 3 && <div>Free Agency Screen</div>}
      {phase === 4 && <div>Draft Screen</div>}
      {phase === 5 && <div>Season Prep Screen</div>}
    </div>
  );
}