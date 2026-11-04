import type { PersonaId, GamificationProfile } from '../models'
import { GamificationRepository } from '../repositories'

export const GamificationService = {
  getProfile(personaId: PersonaId): GamificationProfile {
    return GamificationRepository.findByPersona(personaId)
  },

  completeMission(personaId: PersonaId, missionId: string): GamificationProfile | null {
    const success = GamificationRepository.completeMission(personaId, missionId)
    if (!success) return null
    return GamificationRepository.findByPersona(personaId)
  },
}
