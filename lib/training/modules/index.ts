export * from './types'
import { Module } from './types'
import { phase1Modules } from './phase1'
import { phase2Modules } from './phase2'
import { phase3Modules } from './phase3'

export const trainingModules: Module[] = [
  ...phase1Modules,
  ...phase2Modules,
  ...phase3Modules,
]

export function getModulesByPhase(phase: number): Module[] {
  return trainingModules.filter(module => module.phase === phase)
}

export function getModuleById(id: string): Module | undefined {
  return trainingModules.find(module => module.id === id)
}

export function getTotalModules(): number {
  return trainingModules.length
}

export function getPhaseProgress(phase: number, completedModuleIds: string[]): number {
  const phaseModules = getModulesByPhase(phase)
  const completed = phaseModules.filter(m => completedModuleIds.includes(m.id)).length
  return phaseModules.length > 0 ? (completed / phaseModules.length) * 100 : 0
}