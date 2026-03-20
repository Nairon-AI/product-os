import { CheckIcon, ArrowRightIcon, WrenchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnyPhaseId, FeatureMode, FeatureFiles } from '@/types/sprint'
import { getPhasesForMode, getPhaseStatusForMode, hasEngSpec } from '@/types/sprint'

const ENG_PHASE_IDS = ['engineer', 'investigate', 'specify']

interface PhaseNavProps {
  completedPhases: AnyPhaseId[]
  currentPhase: AnyPhaseId
  viewingPhase?: AnyPhaseId
  onPhaseClick?: (phaseId: AnyPhaseId) => void
  mode?: FeatureMode
  files?: FeatureFiles
}

export function PhaseNav({ completedPhases, currentPhase, viewingPhase, onPhaseClick, mode = 'comprehensive', files }: PhaseNavProps) {
  const phases = getPhasesForMode(mode, files)

  // Split phases into product and engineering groups
  const productPhases = phases.filter(p => !ENG_PHASE_IDS.includes(p.id))
  const engPhases = phases.filter(p => ENG_PHASE_IDS.includes(p.id))

  const renderPhaseButton = (phase: typeof phases[0], isLast: boolean) => {
    const status = getPhaseStatusForMode(phase.id as AnyPhaseId, completedPhases, currentPhase)
    const isViewing = viewingPhase === phase.id

    return (
      <div key={phase.id} className="flex items-center">
        <button
          onClick={() => onPhaseClick?.(phase.id)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors',
            status === 'completed' && 'bg-lime-500/20 text-lime-600 dark:text-lime-400 hover:bg-lime-500/30',
            status === 'current' && 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900',
            status === 'upcoming' && 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-500 dark:hover:text-stone-400',
            isViewing && 'ring-2 ring-stone-400 dark:ring-stone-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900'
          )}
        >
          {status === 'completed' && (
            <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span className="hidden sm:inline">{phase.name}</span>
          <span className="sm:hidden">{phase.name.slice(0, 3)}</span>
        </button>

        {!isLast && (
          <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-stone-300 dark:text-stone-600" />
        )}
      </div>
    )
  }

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
      {/* Product phases */}
      {productPhases.map((phase, index) =>
        renderPhaseButton(phase, index === productPhases.length - 1)
      )}

      {/* Separator between product and engineering (only when eng spec is active) */}
      {engPhases.length > 0 && files && hasEngSpec(files) && (
        <div className="flex items-center mx-1 sm:mx-2">
          <div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1" />
          <WrenchIcon className="w-3 h-3 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500 mx-1" />
          <div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1" />
        </div>
      )}

      {/* Engineering phases */}
      {engPhases.map((phase, index) =>
        renderPhaseButton(phase, index === engPhases.length - 1)
      )}
    </nav>
  )
}
