export type StaffRole =
  | "HC"
  | "OC"
  | "DC"
  | "STC"
  | "HAT"
  | "DPP"
  | "HEAD_SCOUT"
  | "REGIONAL_SCOUT_EAST"
  | "REGIONAL_SCOUT_WEST"
  | "DA"
  | "QBC";

export type HeadCoachType =
  | "ceo"
  | "mastermind"
  | "teacher"
  | "strategist"
  | "hybrid";

export interface StaffMemberBase {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  age: number;
  yearsExperience: number;
}

export interface HeadCoach extends StaffMemberBase {
  role: "HC";
  type: HeadCoachType;
  leadership: number;
  culture: number;
  strategy: number;
  playerDevelopment: number;
  discipline: number;
  schemeOffense: string;
  schemeDefense: string;
  schemeFlexibility: number;
  staffManagement: number;
}

export interface OffensiveCoordinator extends StaffMemberBase {
  role: "OC";
  playCalling: number;
  qbDevelopment: number;
  skillPlayerDevelopment: number;
  offensiveSchemeKnowledge: number;
  runGameDesign: number;
  passGameDesign: number;
  creativity: number;
  schemePreference: string;
}

export interface DefensiveCoordinator extends StaffMemberBase {
  role: "DC";
  playCalling: number;
  frontSevenDevelopment: number;
  secondaryDevelopment: number;
  defensiveSchemeKnowledge: number;
  blitzDesign: number;
  coverageDesign: number;
  discipline: number;
  schemePreference: string;
}

export interface StrengthCoach extends StaffMemberBase {
  role: "STC";
  injuryPrevention: number;
  recoverySpeed: number;
  conditioning: number;
  strengthTraining: number;
  speedTraining: number;
  workEthicBoost: number;
}

export interface AthleticTrainer extends StaffMemberBase {
  role: "HAT";
  diagnosisAccuracy: number;
  rehabQuality: number;
  injuryRiskAssessment: number;
  returnToPlayConservatism: number;
  longTermHealthManagement: number;
}

export interface DirectorPlayerPersonnel extends StaffMemberBase {
  role: "DPP";
  proEvaluation: number;
  contractInsight: number;
  tradeValueAssessment: number;
  rosterConstruction: number;
  schemeFitAwareness: number;
  developmentProjection: number;
}

export interface HeadScout extends StaffMemberBase {
  role: "HEAD_SCOUT";
  draftBoardManagement: number;
  prospectEvaluation: number;
  combineInterpretation: number;
  positionalNeedsAwareness: number;
  scoutingAccuracy: number;
  regionalCoordination: number;
}

export interface RegionalScout extends StaffMemberBase {
  role: "REGIONAL_SCOUT_EAST" | "REGIONAL_SCOUT_WEST";
  regionalKnowledge: number;
  positionalStrengths: number;
  evaluationAccuracy: number;
  intangiblesAssessment: number;
  schemeFitProjection: number;
}

export interface DirectorAnalytics extends StaffMemberBase {
  role: "DA";
  modelingQuality: number;
  fourthDownAggressiveness: number;
  riskManagement: number;
  contractValuation: number;
  injuryRiskModeling: number;
  tendencyAnalysis: number;
}

export interface QuarterbackCoach extends StaffMemberBase {
  role: "QBC";
  mechanicsTraining: number;
  decisionMakingTraining: number;
  accuracyDevelopment: number;
  pocketPresenceDevelopment: number;
  leadershipMentoring: number;
  filmStudyImpact: number;
}

export type StaffMember =
  | HeadCoach
  | OffensiveCoordinator
  | DefensiveCoordinator
  | StrengthCoach
  | AthleticTrainer
  | DirectorPlayerPersonnel
  | HeadScout
  | RegionalScout
  | DirectorAnalytics
  | QuarterbackCoach;