import { useState, useEffect } from 'react'
import type { Sprint, PhaseId, FeatureFiles, Project, Category, FeatureMode, AnyPhaseId, LitePhaseId } from '@/types/sprint'

const POLL_INTERVAL = 2000 // 2 seconds

// Determine current phase based on which files exist
function determineCurrentPhase(files: FeatureFiles, mode: FeatureMode = 'comprehensive'): AnyPhaseId {
  // Engineering spec phases (only if eng flow has been started)
  const hasEng = !!(files['eng-context.md'] || files['eng-decisions.md'] || files['engineering-spec.md'] || files['eng-handoff.md'])
  if (hasEng) {
    if (files['engineering-spec.md']) return 'specify'
    if (files['eng-decisions.md']) return 'specify'
    if (files['eng-context.md']) return 'investigate'
  }

  if (mode === 'lite') {
    // Lite mode: start → problem → solution → handoff
    if (files['handoff-complete.md']) return 'handoff'
    if (files['prd.md']) return 'handoff'
    if (files['solution-output.md']) return 'solution'
    if (files['problem-output.md']) return 'solution'
    if (files['inputs-summary.md']) return 'problem'
    return 'start'
  }

  // Comprehensive mode: start → discover → define → develop → deliver → handoff
  if (files['handoff-complete.md']) return 'handoff'
  if (files['prd.md'] && files['qa.md'] && files['linear-tickets.md'] && files['loom-outline.md']) {
    return 'handoff'
  }
  if (files['prd.md']) return 'deliver'
  if (files['develop-output.md']) return 'deliver'
  if (files['problem-statement.md']) return 'develop'
  if (files['discover-output.md']) return 'define'
  if (files['inputs-summary.md']) return 'discover'
  return 'start'
}

// Determine completed phases based on files and completedSteps
// Content-marker phases require all steps to be documented
// File-based phases just check for file existence
function determineCompletedPhases(
  files: FeatureFiles,
  mode: FeatureMode = 'comprehensive',
  completedSteps: Record<string, number[]> = {}
): AnyPhaseId[] {
  // Engineering spec phases (only when eng flow has been started)
  const hasEng = !!(files['eng-context.md'] || files['eng-decisions.md'] || files['engineering-spec.md'] || files['eng-handoff.md'])
  const addEngPhases = (completed: AnyPhaseId[]) => {
    if (!hasEng) return
    if (files['eng-context.md']) completed.push('engineer')
    // Investigate: check content markers
    const investigateSteps = completedSteps['investigate'] || []
    if (investigateSteps.length >= 4 && [1, 2, 3, 4].every(n => investigateSteps.includes(n))) {
      completed.push('investigate')
    }
    if (files['engineering-spec.md']) completed.push('specify')
  }

  if (mode === 'lite') {
    // Lite mode phases
    const completed: LitePhaseId[] = []
    if (files['inputs-summary.md']) completed.push('start')
    // Problem phase: requires all 5 steps (Core Desire, Reasoning Chain, Blind Spots, Risks, Problem Statement)
    const problemSteps = completedSteps['problem'] || []
    if (problemSteps.length >= 5 && [1, 2, 3, 4, 5].every(n => problemSteps.includes(n))) {
      completed.push('problem')
    }
    // Solution phase: requires all 7 steps
    const solutionSteps = completedSteps['solution'] || []
    if (solutionSteps.length >= 7 && [1, 2, 3, 4, 5, 6, 7].every(n => solutionSteps.includes(n))) {
      completed.push('solution')
    }
    if (files['handoff-complete.md']) completed.push('handoff')
    addEngPhases(completed)
    return completed
  }

  // Comprehensive mode phases
  const completed: PhaseId[] = []
  if (files['inputs-summary.md']) completed.push('start')
  // Discover phase: requires all 6 steps
  const discoverSteps = completedSteps['discover'] || []
  if (discoverSteps.length >= 6 && [1, 2, 3, 4, 5, 6].every(n => discoverSteps.includes(n))) {
    completed.push('discover')
  }
  // Define phase: requires all 5 steps
  const defineSteps = completedSteps['define'] || []
  if (defineSteps.length >= 5 && [1, 2, 3, 4, 5].every(n => defineSteps.includes(n))) {
    completed.push('define')
  }
  // Develop phase: requires all 8 steps
  const developSteps = completedSteps['develop'] || []
  if (developSteps.length >= 8 && [1, 2, 3, 4, 5, 6, 7, 8].every(n => developSteps.includes(n))) {
    completed.push('develop')
  }
  // Deliver phase: requires all 4 output files
  if (files['prd.md'] && files['qa.md'] && files['linear-tickets.md'] && files['loom-outline.md']) {
    completed.push('deliver')
  }
  if (files['handoff-complete.md']) completed.push('handoff')
  addEngPhases(completed)
  return completed
}

// API response types
interface ApiFeature {
  id: string
  name: string
  sprintWeek: string
  projectId?: string
  projectName?: string
  mode?: FeatureMode
  files: FeatureFiles
  completedSteps?: Record<string, number[]>
}

interface ApiSprint {
  week: string
  features: ApiFeature[]
}

// Transform API response into typed Sprint data
function transformSprints(data: ApiSprint[]): Sprint[] {
  return data.map(sprint => ({
    week: sprint.week,
    features: sprint.features.map((f: ApiFeature) => {
      const mode: FeatureMode = f.mode || 'comprehensive'
      const completedSteps = f.completedSteps || {}
      return {
        id: f.id,
        name: f.name,
        type: 'new' as const,
        mode,
        sprintWeek: f.sprintWeek,
        projectId: f.projectId || 'unknown',
        projectName: f.projectName || 'Unknown',
        files: f.files,
        currentPhase: determineCurrentPhase(f.files, mode),
        completedPhases: determineCompletedPhases(f.files, mode, completedSteps),
        completedSteps,
      }
    }),
  }))
}

export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchSprints = async () => {
      try {
        const res = await fetch('/__api/sprints')
        const data = await res.json()
        if (mounted) {
          setSprints(transformSprints(data))
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch sprints:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchSprints()
    const interval = setInterval(fetchSprints, POLL_INTERVAL)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return { sprints, loading }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProjects = async () => {
      try {
        const res = await fetch('/__api/projects')
        const data = await res.json()
        if (mounted) {
          setProjects(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchProjects()

    return () => {
      mounted = false
    }
  }, [])

  return { projects, loading }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchCategories = async () => {
      try {
        const res = await fetch('/__api/categories')
        const data = await res.json()
        if (mounted) {
          setCategories(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchCategories()

    return () => {
      mounted = false
    }
  }, [])

  return { categories, loading }
}

export function useFeature(week: string, name: string) {
  const { sprints, loading } = useSprints()

  const sprint = sprints.find(s => s.week === week)
  const feature = sprint?.features.find(f => f.name === name) || null

  return { feature, loading }
}

// Get current week in YYYY-WXX format
export function getCurrentWeek(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
}
