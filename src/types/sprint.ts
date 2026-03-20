/**
 * Product OS Types
 * Types for sprint tracking, features, and phases
 */

export type PhaseId = 'start' | 'discover' | 'define' | 'develop' | 'deliver' | 'handoff' | 'engineer' | 'investigate' | 'specify'
export type LitePhaseId = 'start' | 'problem' | 'solution' | 'handoff' | 'engineer' | 'investigate' | 'specify'
export type AnyPhaseId = PhaseId | LitePhaseId
export type FeatureMode = 'comprehensive' | 'lite'

export type PhaseStatus = 'completed' | 'current' | 'upcoming'

export interface Phase {
  id: AnyPhaseId
  name: string
  description: string
  command: string
  steps: PhaseStep[]
  exitFile: string // File that indicates this phase is complete
}

export interface PhaseStep {
  number: number
  title: string
  description: string
  deliverable: string
}

export interface Category {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  category?: string
  description: string
  path: string
  sprintsPath: string
  contextFile: string
}

export interface Feature {
  id: string
  name: string
  type: 'new' | 'improvement'
  mode: FeatureMode
  currentPhase: AnyPhaseId
  completedPhases: AnyPhaseId[]
  completedSteps: Record<string, number[]> // e.g., { discover: [1, 2, 3] }
  files: FeatureFiles
  sprintWeek: string // e.g., "2025-W02"
  projectId: string // e.g., "keylead" or "nairon-slackapp"
  projectName: string // e.g., "Keylead" or "Nairon Slack App"
}

export interface FeatureFiles {
  'project.json'?: boolean
  'codebase-discovery.md'?: boolean
  'inputs-summary.md'?: boolean
  'raw-input-transcript.md'?: boolean
  'raw-input-slack.md'?: boolean
  'raw-input-feedback.md'?: boolean
  'discover-output.md'?: boolean
  'problem-statement.md'?: boolean
  'develop-output.md'?: boolean
  'prd.md'?: boolean
  'qa.md'?: boolean
  'linear-tickets.md'?: boolean
  'loom-outline.md'?: boolean
  'handoff-complete.md'?: boolean
  // Lite mode files
  'problem-output.md'?: boolean
  'solution-output.md'?: boolean
  // Engineering spec files
  'eng-context.md'?: boolean
  'eng-decisions.md'?: boolean
  'engineering-spec.md'?: boolean
  'eng-handoff.md'?: boolean
}

export interface Sprint {
  week: string // e.g., "2025-W02"
  features: Feature[]
}

// Phase definitions with steps
export const PHASES: Phase[] = [
  {
    id: 'start',
    name: 'Start',
    description: 'Initialize feature and capture raw inputs',
    command: '/start',
    exitFile: 'inputs-summary.md',
    steps: [
      { number: 1, title: 'Select Project', description: 'Choose which project this is for', deliverable: 'project.json' },
      { number: 2, title: 'Select Mode', description: 'Comprehensive or Lite?', deliverable: 'Mode stored' },
      { number: 3, title: 'Create Directory', description: 'Set up feature folder', deliverable: 'Directory created' },
      { number: 4, title: 'Codebase Discovery', description: 'Scan product area for context', deliverable: 'codebase-discovery.md' },
      { number: 5, title: 'Feature Type', description: 'New feature or improvement?', deliverable: 'Type documented' },
      { number: 6, title: 'Import Transcript', description: 'Paste stakeholder call transcript', deliverable: 'raw-input-transcript.md' },
      { number: 7, title: 'Import Slack', description: 'Paste relevant Slack threads', deliverable: 'raw-input-slack.md' },
      { number: 8, title: 'Import Feedback', description: 'Paste customer feedback', deliverable: 'raw-input-feedback.md' },
      { number: 9, title: 'Design Links', description: 'Add Figma or design references', deliverable: 'Links captured' },
      { number: 10, title: 'Summarize', description: 'Review all inputs', deliverable: 'inputs-summary.md' },
    ],
  },
  {
    id: 'discover',
    name: 'Discover',
    description: 'Explore the problem space broadly (diverge)',
    command: '/discover',
    exitFile: 'discover-output.md',
    steps: [
      { number: 1, title: 'Core Desire', description: 'Why are we doing this?', deliverable: 'Documented' },
      { number: 2, title: 'Reasoning Chain', description: 'Does the logic hold?', deliverable: 'Documented' },
      { number: 3, title: 'User Perspective', description: 'How would users react?', deliverable: 'Documented' },
      { number: 4, title: 'Blind Spots', description: 'What are we missing?', deliverable: 'Documented' },
      { number: 5, title: 'Risks', description: 'What could go wrong?', deliverable: 'Documented' },
      { number: 6, title: 'Exit Check', description: 'Fully explored?', deliverable: 'discover-output.md' },
    ],
  },
  {
    id: 'define',
    name: 'Define',
    description: 'Narrow to one clear problem statement (converge)',
    command: '/define',
    exitFile: 'problem-statement.md',
    steps: [
      { number: 1, title: 'Synthesize', description: 'Group findings into clusters', deliverable: 'Themes identified' },
      { number: 2, title: 'Narrow Down', description: 'Use gut feel to reduce options', deliverable: 'Options reduced' },
      { number: 3, title: 'Articulate', description: 'Write one-sentence problem', deliverable: 'One sentence' },
      { number: 4, title: 'Defend Check', description: 'Can you defend to stakeholder?', deliverable: 'problem-statement.md' },
    ],
  },
  {
    id: 'develop',
    name: 'Develop',
    description: 'Explore solutions - UI flows, wireframes, edge cases (diverge)',
    command: '/develop',
    exitFile: 'develop-output.md',
    steps: [
      { number: 1, title: 'UI Flow Options', description: 'Brainstorm approaches', deliverable: 'Options documented' },
      { number: 2, title: 'Desktop Wireframe', description: 'ASCII wireframe for desktop', deliverable: 'ASCII wireframe' },
      { number: 3, title: 'Mobile Wireframe', description: 'ASCII wireframe for mobile', deliverable: 'ASCII wireframe' },
      { number: 4, title: 'Edge Cases', description: 'Surface all "what ifs"', deliverable: 'Edge cases list' },
      { number: 5, title: 'Codebase Risks', description: 'Analyze project impact', deliverable: 'Risks documented' },
      { number: 6, title: 'Trade-offs', description: 'Evaluate options', deliverable: 'Trade-off analysis' },
      { number: 7, title: 'Exit Check', description: 'Ready to finalize?', deliverable: 'develop-output.md' },
    ],
  },
  {
    id: 'deliver',
    name: 'Deliver',
    description: 'Generate PRD, QA checklist, Linear tickets, Loom outline (converge)',
    command: '/deliver',
    exitFile: 'prd.md',
    steps: [
      { number: 1, title: 'Generate PRD', description: 'Create comprehensive PRD', deliverable: 'prd.md' },
      { number: 2, title: 'Generate QA', description: 'Create QA checklist', deliverable: 'qa.md' },
      { number: 3, title: 'Generate Tickets', description: 'Create Linear tickets', deliverable: 'linear-tickets.md' },
      { number: 4, title: 'Generate Loom', description: 'Create video outline', deliverable: 'loom-outline.md' },
    ],
  },
  {
    id: 'handoff',
    name: 'Handoff',
    description: 'Validate, commit, push, and notify stakeholders',
    command: '/handoff',
    exitFile: 'handoff-complete.md',
    steps: [
      { number: 1, title: 'Validate Deliverables', description: 'Check all files exist', deliverable: 'Validated' },
      { number: 2, title: 'Pull, Commit, Push', description: 'Push to project repo', deliverable: 'Pushed' },
      { number: 3, title: 'Implementation Prompt', description: 'Generate prompt for engineers', deliverable: 'handoff-complete.md' },
    ],
  },
]

// Lite mode phase definitions (4 phases instead of 6)
export const LITE_PHASES: Phase[] = [
  {
    id: 'start',
    name: 'Start',
    description: 'Initialize feature and capture quick summary',
    command: '/start',
    exitFile: 'inputs-summary.md',
    steps: [
      { number: 1, title: 'Project Selected', description: 'Choose which project this is for', deliverable: 'project.json' },
      { number: 2, title: 'Mode Selected', description: 'Comprehensive or Lite?', deliverable: 'Mode stored' },
      { number: 3, title: 'Directory Created', description: 'Create feature directory', deliverable: 'Directory created' },
      { number: 4, title: 'Codebase Discovery', description: 'Scan product area for context', deliverable: 'codebase-discovery.md' },
      { number: 5, title: 'Feature Summary', description: 'Describe the feature briefly', deliverable: 'inputs-summary.md' },
    ],
  },
  {
    id: 'problem',
    name: 'Problem',
    description: 'Define the problem (discover + define combined)',
    command: '/problem',
    exitFile: 'problem-output.md',
    steps: [
      { number: 1, title: 'Core Desire', description: 'Why are we doing this?', deliverable: 'Documented' },
      { number: 2, title: 'Reasoning Chain', description: 'Does the logic hold?', deliverable: 'Documented' },
      { number: 3, title: 'Blind Spots', description: 'What are we missing?', deliverable: 'Documented' },
      { number: 4, title: 'Risks', description: 'What could go wrong?', deliverable: 'Documented' },
      { number: 5, title: 'Problem Statement', description: 'One-sentence problem', deliverable: 'problem-output.md' },
    ],
  },
  {
    id: 'solution',
    name: 'Solution',
    description: 'Design the solution and generate PRD',
    command: '/solution',
    exitFile: 'prd.md',
    steps: [
      { number: 1, title: 'Solution Approach', description: 'How will we solve it?', deliverable: 'solution-output.md' },
      { number: 2, title: 'UI Flow', description: 'Brainstorm approaches', deliverable: 'Documented' },
      { number: 3, title: 'Desktop Wireframe', description: 'ASCII wireframe', deliverable: 'ASCII wireframe' },
      { number: 4, title: 'Mobile Wireframe', description: 'ASCII wireframe', deliverable: 'ASCII wireframe' },
      { number: 5, title: 'Edge Cases', description: 'Surface all "what ifs"', deliverable: 'Edge cases list' },
      { number: 6, title: 'Trade-offs', description: 'Evaluate options', deliverable: 'Trade-off analysis' },
      { number: 7, title: 'PRD Generated', description: 'Create PRD', deliverable: 'prd.md' },
    ],
  },
  {
    id: 'handoff',
    name: 'Handoff',
    description: 'Validate, commit, and generate implementation prompt',
    command: '/handoff',
    exitFile: 'handoff-complete.md',
    steps: [
      { number: 1, title: 'Deliverables Validated', description: 'Check file exists', deliverable: 'Validated' },
      { number: 2, title: 'Committed and Pushed', description: 'Git operations', deliverable: 'Pushed' },
      { number: 3, title: 'Implementation Prompt', description: 'Generate implementation prompt', deliverable: 'handoff-complete.md' },
    ],
  },
]

// Engineering spec phases (optional — only shown when /engineer has been run)
export const ENG_PHASES: Phase[] = [
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'Ingest product handoff and orient technically',
    command: '/engineer',
    exitFile: 'eng-context.md',
    steps: [
      { number: 1, title: 'Select Feature', description: 'Point to the handoff folder', deliverable: 'Feature selected' },
      { number: 2, title: 'Ingest Artifacts', description: 'Read all product spec files', deliverable: 'Artifacts ingested' },
      { number: 3, title: 'Deep Codebase Scan', description: 'Scan affected files and patterns', deliverable: 'Codebase scanned' },
      { number: 4, title: 'Technical Digest', description: 'Translate PRD to engineering terms', deliverable: 'Digest written' },
      { number: 5, title: 'Decision Points', description: 'Identify architectural decisions', deliverable: 'Decisions mapped' },
      { number: 6, title: 'Engineer Context', description: 'Capture familiarity and constraints', deliverable: 'eng-context.md' },
    ],
  },
  {
    id: 'investigate',
    name: 'Investigate',
    description: 'Explore technical decisions through guided investigation',
    command: '/investigate',
    exitFile: 'eng-decisions.md',
    steps: [
      { number: 1, title: 'Decision Map Review', description: 'Prioritize investigation order', deliverable: 'Order locked' },
      { number: 2, title: 'Investigate Decisions', description: 'Explore each decision point', deliverable: 'Decisions locked' },
      { number: 3, title: 'Cross-Cutting Concerns', description: 'Security, errors, observability', deliverable: 'Documented' },
      { number: 4, title: 'Technical Dependencies', description: 'Map build sequence', deliverable: 'Sequence defined' },
      { number: 5, title: 'Risk Assessment', description: 'Surface risks and unknowns', deliverable: 'Risks documented' },
      { number: 6, title: 'Exit Check', description: 'Confirm all decisions locked', deliverable: 'eng-decisions.md' },
    ],
  },
  {
    id: 'specify',
    name: 'Specify',
    description: 'Compile engineering spec and generate implementation handoff',
    command: '/specify',
    exitFile: 'engineering-spec.md',
    steps: [
      { number: 1, title: 'Generate Spec', description: 'Compile engineering spec', deliverable: 'engineering-spec.md' },
      { number: 2, title: 'Review Requirements', description: 'Validate technical requirements', deliverable: 'Requirements confirmed' },
      { number: 3, title: 'Review Risks', description: 'Tag blocking vs non-blocking', deliverable: 'Risks tagged' },
      { number: 4, title: 'Package Check', description: 'Verify all files exist', deliverable: 'Validated' },
      { number: 5, title: 'Implementation Handoff', description: 'Generate handoff message', deliverable: 'eng-handoff.md' },
    ],
  },
]

// Check if engineering spec flow is active for a feature (any eng file exists)
export function hasEngSpec(files: FeatureFiles): boolean {
  return !!(files['eng-context.md'] || files['eng-decisions.md'] || files['engineering-spec.md'] || files['eng-handoff.md'])
}

// Helper to get phases for a given mode, optionally including eng phases
export function getPhasesForMode(mode: FeatureMode, files?: FeatureFiles): Phase[] {
  const base = mode === 'lite' ? LITE_PHASES : PHASES
  if (files && hasEngSpec(files)) {
    return [...base, ...ENG_PHASES]
  }
  return base
}

// Helper to get phase by ID (comprehensive mode)
export function getPhase(id: PhaseId): Phase | undefined {
  return [...PHASES, ...ENG_PHASES].find(p => p.id === id)
}

// Helper to get phase by ID for any mode
export function getPhaseForMode(id: AnyPhaseId, mode: FeatureMode, files?: FeatureFiles): Phase | undefined {
  const phases = getPhasesForMode(mode, files)
  return phases.find(p => p.id === id)
}

// Helper to get next phase (comprehensive mode)
export function getNextPhase(currentId: PhaseId): Phase | undefined {
  const currentIndex = PHASES.findIndex(p => p.id === currentId)
  if (currentIndex === -1 || currentIndex === PHASES.length - 1) return undefined
  return PHASES[currentIndex + 1]
}

// Helper to get next phase for any mode
export function getNextPhaseForMode(currentId: AnyPhaseId, mode: FeatureMode, files?: FeatureFiles): Phase | undefined {
  const phases = getPhasesForMode(mode, files)
  const currentIndex = phases.findIndex(p => p.id === currentId)
  if (currentIndex === -1 || currentIndex === phases.length - 1) return undefined
  return phases[currentIndex + 1]
}

// Helper to determine phase status
export function getPhaseStatus(phaseId: PhaseId, completedPhases: PhaseId[], currentPhase: PhaseId): PhaseStatus {
  if (completedPhases.includes(phaseId)) return 'completed'
  if (phaseId === currentPhase) return 'current'
  return 'upcoming'
}

// Helper to determine phase status for any mode
export function getPhaseStatusForMode(phaseId: AnyPhaseId, completedPhases: AnyPhaseId[], currentPhase: AnyPhaseId): PhaseStatus {
  if (completedPhases.includes(phaseId)) return 'completed'
  if (phaseId === currentPhase) return 'current'
  return 'upcoming'
}
