import { CheckIcon, ClipboardIcon, ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AnyPhaseId, FeatureFiles, FeatureMode } from '@/types/sprint'
import { getPhaseForMode, getNextPhaseForMode } from '@/types/sprint'

interface PhasePanelProps {
  phaseId: AnyPhaseId
  isComplete: boolean
  files?: FeatureFiles
  completedSteps?: Record<string, number[]>
  mode?: FeatureMode
}

export function PhasePanel({ phaseId, isComplete, files = {}, completedSteps = {}, mode = 'comprehensive' }: PhasePanelProps) {
  const [copied, setCopied] = useState(false)
  const phase = getPhaseForMode(phaseId, mode)
  const nextPhase = getNextPhaseForMode(phaseId, mode)

  if (!phase) return null

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(phase.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get completed steps for this phase from content markers
  const phaseCompletedSteps = completedSteps[phaseId] || []

  // Phases that use content markers (single output file with sections matching step names)
  // For these, completion is determined by backend scanning for section headings with real content
  // Note: 'deliver' is excluded because it produces individual files (prd.md, qa.md, etc.) not sections
  const contentMarkerPhases = mode === 'lite'
    ? ['start', 'problem', 'solution', 'handoff']
    : ['discover', 'define', 'develop']

  // A step is complete if:
  // 1. The entire phase is complete — all steps are done
  // 2. For content marker phases: it's in the completedSteps array from backend
  // 3. For file-based phases (start, deliver, handoff): its individual file deliverable exists
  const isStepComplete = (stepNumber: number) => {
    // If the phase is complete, ALL steps are complete
    if (isComplete) return true

    // For phases with content markers, use the backend detection
    if (contentMarkerPhases.includes(phaseId)) {
      return phaseCompletedSteps.includes(stepNumber)
    }

    // For file-based phases, check if each step's deliverable file exists
    const step = phase.steps.find(s => s.number === stepNumber)
    if (step) {
      const deliverable = step.deliverable
      if ((deliverable.endsWith('.md') || deliverable.endsWith('.json')) && files[deliverable as keyof FeatureFiles]) {
        return true
      }
    }

    return false
  }

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {phase.name}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            {phase.description}
          </p>
        </div>
        {isComplete && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-lime-500/20 text-lime-600 dark:text-lime-400 rounded-full text-sm font-medium">
            <CheckIcon className="w-4 h-4" />
            Complete
          </div>
        )}
      </div>

      {/* Command */}
      <div className="mb-6">
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          Command
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-md font-mono text-sm text-stone-800 dark:text-stone-200">
            {phase.command}
          </code>
          <button
            onClick={handleCopyCommand}
            className={cn(
              'p-2 rounded-md transition-colors',
              copied
                ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            )}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ClipboardIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Steps Checklist */}
      <div>
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          Steps
        </label>
        <div className="mt-3 space-y-2">
          {phase.steps.map((step) => {
            const stepComplete = isStepComplete(step.number)

            return (
              <div
                key={step.number}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md transition-colors",
                  stepComplete
                    ? "bg-lime-500/10"
                    : "bg-stone-50 dark:bg-stone-800/50"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    stepComplete
                      ? "bg-lime-500 text-white"
                      : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400"
                  )}
                >
                  {stepComplete ? (
                    <CheckIcon className="w-3.5 h-3.5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-medium text-sm",
                      stepComplete
                        ? "text-lime-700 dark:text-lime-400"
                        : "text-stone-800 dark:text-stone-200"
                    )}
                  >
                    {step.title}
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      stepComplete
                        ? "text-lime-600/70 dark:text-lime-500/70"
                        : "text-stone-500 dark:text-stone-400"
                    )}
                  >
                    {step.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex-shrink-0 text-xs",
                    stepComplete
                      ? "text-lime-600 dark:text-lime-500"
                      : "text-stone-400 dark:text-stone-500"
                  )}
                >
                  {step.deliverable}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Next Phase */}
      {isComplete && nextPhase && (
        <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-stone-600 dark:text-stone-400">
              Ready for next phase
            </span>
            <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400 font-medium">
              {nextPhase.name}
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
