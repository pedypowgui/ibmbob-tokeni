import { nanoid } from 'nanoid'
import type {
  PersonaId,
  Journey,
  JourneyLevel,
  JourneyMission,
  JourneyProposal,
  XPHistory,
} from '../models'
import {
  JourneyRepository,
  LevelRepository,
  MissionRepository,
  XPHistoryRepository,
  UserProgressRepository,
} from '../repositories/journeyRepository'

// ─── Seed data — jornadas simuladas por persona ───────────────────────────────

const SEED_PROPOSALS: Record<PersonaId, JourneyProposal> = {
  jose: {
    title: 'Minha primeira moto',
    description: 'Organize suas finanças para conquistar sua primeira moto com consciência e planejamento.',
    targetAmount: 12000,
    levels: [
      {
        order: 1,
        title: 'Sonhador',
        description: 'Conheça sua realidade financeira.',
        objective: 'Identificar a situação financeira e definir a meta.',
        mainMission: {
          title: 'Mapeie suas despesas',
          description: 'Identifique e categorize todas as suas despesas recorrentes do mês.',
          rewardXp: 100,
          completionType: 'automatic',
          completionCriteria: {
            type: 'expenses_categorized',
            description: 'Ter pelo menos 5 transações categorizadas no sistema.',
            targetValue: 5,
            currentValue: 0,
          },
        },
        secondaryMissions: [
          {
            title: 'Conheça seu orçamento',
            description: 'Acesse a tela de orçamento e confira onde seu dinheiro está indo.',
            rewardXp: 30,
            completionType: 'manual',
            completionCriteria: {
              type: 'viewed_budget',
              description: 'Confirmar que visualizou o painel de orçamento.',
            },
          },
        ],
      },
      {
        order: 2,
        title: 'Explorador',
        description: 'Identifique e comece a reorganizar seus gastos variáveis.',
        objective: 'Reduzir gastos desnecessários e identificar espaço para poupar.',
        mainMission: {
          title: 'Corte o supérfluo',
          description: 'Identifique pelo menos 2 categorias onde você pode reduzir gastos este mês.',
          rewardXp: 150,
          completionType: 'manual',
          completionCriteria: {
            type: 'identified_savings',
            description: 'Confirmar que identificou categorias com gastos reduzíveis.',
            targetValue: 2,
            currentValue: 0,
          },
        },
        secondaryMissions: [
          {
            title: 'Semana consciente',
            description: 'Registre todos os seus gastos por 7 dias seguidos.',
            rewardXp: 80,
            completionType: 'manual',
            completionCriteria: {
              type: 'week_tracked',
              description: 'Confirmar que acompanhou os gastos por 7 dias.',
            },
          },
          {
            title: 'Compare antes de comprar',
            description: 'Na próxima compra acima de R$100, compare ao menos 2 opções.',
            rewardXp: 50,
            completionType: 'manual',
            completionCriteria: {
              type: 'compared_purchase',
              description: 'Confirmar que comparou opções antes de comprar.',
            },
          },
        ],
      },
      {
        order: 3,
        title: 'Construtor',
        description: 'Organize o orçamento e comece a juntar dinheiro para a entrada.',
        objective: 'Acumular pelo menos R$2.400 (20% da meta).',
        mainMission: {
          title: 'Primeiro aporte',
          description: 'Separe R$200 por mês durante 3 meses para sua jornada.',
          rewardXp: 200,
          completionType: 'financial',
          completionCriteria: {
            type: 'accumulated_amount',
            description: 'Acumular pelo menos R$600 no fundo da moto.',
            targetValue: 600,
            currentValue: 0,
          },
        },
        secondaryMissions: [],
      },
      {
        order: 4,
        title: 'Conquistador',
        description: 'Atingir a entrada e avaliar os custos totais da moto.',
        objective: 'Alcançar a entrada de R$3.600 e pesquisar modelos.',
        mainMission: {
          title: 'Entrada no bolso',
          description: 'Acumule o valor de entrada de 30% do objetivo.',
          rewardXp: 300,
          completionType: 'financial',
          completionCriteria: {
            type: 'accumulated_amount',
            description: 'Acumular pelo menos R$3.600.',
            targetValue: 3600,
            currentValue: 0,
          },
        },
        secondaryMissions: [
          {
            title: 'Pesquisador',
            description: 'Compare 3 modelos de moto e anote os custos de seguro, documentação e manutenção.',
            rewardXp: 60,
            completionType: 'educational',
            completionCriteria: {
              type: 'research_completed',
              description: 'Confirmar que pesquisou os custos totais.',
            },
          },
        ],
      },
      {
        order: 5,
        title: 'Realizador',
        description: 'Tomar uma decisão consciente e planejar os custos pós-compra.',
        objective: 'Comprar a moto com planejamento e consciência.',
        mainMission: {
          title: 'Decisão consciente',
          description: 'Planejar os custos mensais pós-compra (seguro, combustível, manutenção).',
          rewardXp: 400,
          completionType: 'manual',
          completionCriteria: {
            type: 'post_purchase_plan',
            description: 'Confirmar que criou o plano de custos pós-compra.',
          },
        },
        secondaryMissions: [],
      },
    ],
  },
  janaina: {
    title: 'Reserva de emergência',
    description: 'Construa uma reserva que proteja sua família de imprevistos com tranquilidade e pequenos passos.',
    targetAmount: 5000,
    levels: [
      {
        order: 1,
        title: 'Organizadora',
        description: 'Entenda para onde vai cada real da família.',
        objective: 'Mapear todas as despesas fixas e variáveis.',
        mainMission: {
          title: 'Lista de contas',
          description: 'Identifique todas as contas fixas mensais da família.',
          rewardXp: 80,
          completionType: 'automatic',
          completionCriteria: {
            type: 'expenses_categorized',
            description: 'Ter pelo menos 5 despesas categorizadas.',
            targetValue: 5,
            currentValue: 0,
          },
        },
        secondaryMissions: [
          {
            title: 'Revisão semanal',
            description: 'Reserve 15 minutos no domingo para revisar os gastos da semana.',
            rewardXp: 40,
            completionType: 'manual',
            completionCriteria: {
              type: 'weekly_review',
              description: 'Confirmar que fez a revisão semanal.',
            },
          },
        ],
      },
      {
        order: 2,
        title: 'Guardiã',
        description: 'Identificar onde é possível economizar sem sacrificar o essencial.',
        objective: 'Encontrar R$200/mês de espaço para a reserva.',
        mainMission: {
          title: 'Espaço para guardar',
          description: 'Identifique uma despesa variável que pode ser reduzida para criar espaço na reserva.',
          rewardXp: 120,
          completionType: 'manual',
          completionCriteria: {
            type: 'identified_savings',
            description: 'Confirmar que encontrou uma forma de economizar.',
          },
        },
        secondaryMissions: [
          {
            title: 'Mercado planejado',
            description: 'Faça uma lista antes de ir ao supermercado e siga ela.',
            rewardXp: 50,
            completionType: 'manual',
            completionCriteria: {
              type: 'planned_shopping',
              description: 'Confirmar que usou lista no supermercado.',
            },
          },
        ],
      },
      {
        order: 3,
        title: 'Realizadora',
        description: 'Construir a reserva de emergência completa.',
        objective: 'Acumular R$5.000 na reserva.',
        mainMission: {
          title: 'Reserva completa',
          description: 'Acumular R$5.000 guardados como reserva de emergência.',
          rewardXp: 500,
          completionType: 'financial',
          completionCriteria: {
            type: 'accumulated_amount',
            description: 'Ter pelo menos R$5.000 acumulados.',
            targetValue: 5000,
            currentValue: 0,
          },
        },
        secondaryMissions: [],
      },
    ],
  },
}

// ─── Journey Service ──────────────────────────────────────────────────────────

export const JourneyService = {
  /** Retorna a jornada ativa ou pendente de aprovação, ou null (legado) */
  getActiveJourney(profileId: PersonaId): (Journey & { levels: JourneyLevel[]; missions: JourneyMission[] }) | null {
    const journey = JourneyRepository.findActiveByPersona(profileId)
    if (!journey) return null
    return {
      ...journey,
      levels: LevelRepository.findByJourney(journey.id),
      missions: MissionRepository.findByJourney(journey.id),
    }
  },

  /** Retorna todas as jornadas da persona com níveis e missões */
  getAllJourneys(profileId: PersonaId): (Journey & { levels: JourneyLevel[]; missions: JourneyMission[] })[] {
    return JourneyRepository.findAllActiveByPersona(profileId).map(j => ({
      ...j,
      levels: LevelRepository.findByJourney(j.id),
      missions: MissionRepository.findByJourney(j.id),
    }))
  },

  /** Retorna os dados de progresso do usuário */
  getUserProgress(profileId: PersonaId) {
    return UserProgressRepository.find(profileId)
  },

  /** Cria uma jornada a partir de uma proposta (pode haver múltiplas por persona) */
  createJourneyFromProposal(
    profileId: PersonaId,
    proposal: JourneyProposal,
    options?: { goalId?: string; emoji?: string },
  ): Journey {
    const journeyId = nanoid()
    const now = new Date().toISOString()

    const journey: Journey = {
      id: journeyId,
      profileId,
      title: proposal.title,
      description: proposal.description,
      targetAmount: proposal.targetAmount,
      accumulatedAmount: 0,
      currentLevelId: null,
      status: 'pending_approval',
      journeyProgress: 0,
      financialProgress: 0,
      version: 1,
      createdAt: now,
      approvedAt: null,
      updatedAt: now,
      goalId: options?.goalId,
      emoji: options?.emoji,
    }

    JourneyRepository.save(journey)

    // Criar níveis e missões
    for (const levelDef of proposal.levels) {
      const levelId = nanoid()
      const level: JourneyLevel = {
        id: levelId,
        journeyId,
        title: levelDef.title,
        description: levelDef.description,
        order: levelDef.order,
        objective: levelDef.objective,
        status: 'locked',
        completedAt: null,
      }
      LevelRepository.save(level)

      // Missão principal
      const mainId = nanoid()
      MissionRepository.save({
        id: mainId,
        journeyId,
        levelId,
        title: levelDef.mainMission.title,
        description: levelDef.mainMission.description,
        type: 'main',
        completionType: levelDef.mainMission.completionType,
        completionCriteria: levelDef.mainMission.completionCriteria,
        rewardXp: levelDef.mainMission.rewardXp,
        status: 'locked',
        isRepeatable: false,
        completedAt: null,
      })

      // Missões secundárias
      for (const secDef of levelDef.secondaryMissions) {
        MissionRepository.save({
          id: nanoid(),
          journeyId,
          levelId,
          title: secDef.title,
          description: secDef.description,
          type: 'secondary',
          completionType: secDef.completionType,
          completionCriteria: secDef.completionCriteria,
          rewardXp: secDef.rewardXp,
          status: 'locked',
          isRepeatable: false,
          completedAt: null,
        })
      }
    }

    return journey
  },

  /** Carrega proposta seed para persona (fallback quando IA indisponível) */
  createSeedJourney(profileId: PersonaId): Journey {
    const proposal = SEED_PROPOSALS[profileId]
    return JourneyService.createJourneyFromProposal(profileId, proposal)
  },

  /** Cria uma jornada a partir de uma FinancialGoal — gera níveis genéricos de progresso */
  createJourneyFromGoal(
    profileId: PersonaId,
    goal: { id: string; title: string; emoji: string; targetAmount: number; deadline: string },
  ): Journey {
    // Verifica se já existe jornada para essa meta
    const existing = JourneyRepository.findByGoalId(profileId, goal.id)
    if (existing) throw new Error('Já existe uma jornada para esta meta.')

    const monthsUntilDeadline = Math.max(
      1,
      Math.round(
        (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30),
      ),
    )

    const proposal: JourneyProposal = {
      title: goal.title,
      description: `Jornada para alcançar o objetivo "${goal.title}" até ${new Date(goal.deadline).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.`,
      targetAmount: goal.targetAmount,
      levels: [
        {
          order: 1,
          title: 'Planejamento',
          description: 'Defina como vai atingir sua meta.',
          objective: 'Criar um plano de ação claro para o objetivo.',
          mainMission: {
            title: 'Faça seu planejamento',
            description: `Defina quanto vai guardar por mês para atingir ${goal.title}.`,
            rewardXp: 80,
            completionType: 'manual',
            completionCriteria: {
              type: 'manual_confirmation',
              description: 'Confirmar que criou seu plano mensal.',
            },
          },
          secondaryMissions: [
            {
              title: 'Entenda sua meta',
              description: `Para atingir R$ ${goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em ${monthsUntilDeadline} meses, você precisa guardar R$ ${Math.ceil(goal.targetAmount / monthsUntilDeadline).toLocaleString('pt-BR')} por mês.`,
              rewardXp: 30,
              completionType: 'educational',
              completionCriteria: {
                type: 'educational',
                description: 'Leia e entenda os números da sua meta.',
              },
            },
          ],
        },
        {
          order: 2,
          title: 'Primeiros passos',
          description: 'Comece a guardar dinheiro regularmente.',
          objective: `Acumular 25% da meta (R$ ${Math.round(goal.targetAmount * 0.25).toLocaleString('pt-BR')}).`,
          mainMission: {
            title: 'Primeiro quarto',
            description: `Acumule 25% do objetivo: R$ ${Math.round(goal.targetAmount * 0.25).toLocaleString('pt-BR')}.`,
            rewardXp: 150,
            completionType: 'financial',
            completionCriteria: {
              type: 'accumulated_amount',
              description: 'Atingir 25% da meta financeira.',
              targetValue: Math.round(goal.targetAmount * 0.25),
              currentValue: 0,
            },
          },
          secondaryMissions: [],
        },
        {
          order: 3,
          title: 'Na metade',
          description: 'Mantenha o ritmo e chegue na metade.',
          objective: `Acumular 50% da meta (R$ ${Math.round(goal.targetAmount * 0.5).toLocaleString('pt-BR')}).`,
          mainMission: {
            title: 'Metade do caminho',
            description: `Acumule metade do objetivo: R$ ${Math.round(goal.targetAmount * 0.5).toLocaleString('pt-BR')}.`,
            rewardXp: 200,
            completionType: 'financial',
            completionCriteria: {
              type: 'accumulated_amount',
              description: 'Atingir 50% da meta financeira.',
              targetValue: Math.round(goal.targetAmount * 0.5),
              currentValue: 0,
            },
          },
          secondaryMissions: [],
        },
        {
          order: 4,
          title: 'Quase lá',
          description: 'Você está na reta final!',
          objective: `Acumular 75% da meta (R$ ${Math.round(goal.targetAmount * 0.75).toLocaleString('pt-BR')}).`,
          mainMission: {
            title: 'Três quartos',
            description: `Acumule 75% do objetivo: R$ ${Math.round(goal.targetAmount * 0.75).toLocaleString('pt-BR')}.`,
            rewardXp: 250,
            completionType: 'financial',
            completionCriteria: {
              type: 'accumulated_amount',
              description: 'Atingir 75% da meta financeira.',
              targetValue: Math.round(goal.targetAmount * 0.75),
              currentValue: 0,
            },
          },
          secondaryMissions: [],
        },
        {
          order: 5,
          title: 'Conquista',
          description: 'O objetivo está ao alcance!',
          objective: `Atingir 100% da meta (R$ ${goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`,
          mainMission: {
            title: `${goal.title} conquistado!`,
            description: `Acumule o valor total de R$ ${goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para seu objetivo.`,
            rewardXp: 400,
            completionType: 'financial',
            completionCriteria: {
              type: 'accumulated_amount',
              description: 'Atingir 100% da meta.',
              targetValue: goal.targetAmount,
              currentValue: 0,
            },
          },
          secondaryMissions: [],
        },
      ],
    }

    return JourneyService.createJourneyFromProposal(profileId, proposal, {
      goalId: goal.id,
      emoji: goal.emoji,
    })
  },

  /** Aprova a jornada pendente — ativa o primeiro nível */
  approveJourney(profileId: PersonaId, journeyId: string): Journey {
    const journey = JourneyRepository.findById(journeyId)
    if (!journey || journey.profileId !== profileId)
      throw new Error('Jornada não encontrada.')
    if (journey.status !== 'pending_approval')
      throw new Error('A jornada não está aguardando aprovação.')

    JourneyRepository.updateStatus(journeyId, 'active')

    // Desbloquear o primeiro nível
    const levels = LevelRepository.findByJourney(journeyId)
    if (levels.length > 0) {
      const first = levels[0]
      LevelRepository.save({ ...first, status: 'in_progress' })

      // Atualizar currentLevelId
      const updated = JourneyRepository.findById(journeyId)!
      updated.currentLevelId = first.id

      // Desbloquear missões do primeiro nível
      const missions = MissionRepository.findByLevel(first.id)
      for (const m of missions) {
        MissionRepository.save({ ...m, status: 'available' })
      }

      JourneyRepository.save(updated)
    }

    // Conceder XP de conquista "Primeiro passo"
    XPHistoryRepository.add({
      id: nanoid(),
      profileId,
      missionId: 'journey_created',
      sourceId: journeyId,
      amount: 50,
      reason: 'Primeira jornada criada e aprovada!',
      createdAt: new Date().toISOString(),
    })
    UserProgressRepository.addXp(profileId, 50)

    return JourneyRepository.findById(journeyId)!
  },

  /** Cancela a jornada */
  cancelJourney(profileId: PersonaId, journeyId: string): Journey {
    const journey = JourneyRepository.findById(journeyId)
    if (!journey || journey.profileId !== profileId)
      throw new Error('Jornada não encontrada.')
    if (journey.status === 'completed' || journey.status === 'cancelled')
      throw new Error('A jornada já está finalizada.')
    JourneyRepository.updateStatus(journeyId, 'cancelled')
    return JourneyRepository.findById(journeyId)!
  },

  /** Completa uma missão — valida, concede XP e verifica avanço de nível */
  completeMission(
    profileId: PersonaId,
    missionId: string,
  ): { mission: JourneyMission; xpGained: number; levelAdvanced: boolean; journeyCompleted: boolean } {
    const mission = MissionRepository.findById(missionId)
    if (!mission) throw new Error('Missão não encontrada.')

    const journey = JourneyRepository.findById(mission.journeyId)
    if (!journey || journey.profileId !== profileId)
      throw new Error('Missão não pertence à jornada do perfil.')
    if (journey.status !== 'active')
      throw new Error('A jornada não está ativa.')
    if (mission.status === 'completed')
      throw new Error('Missão já concluída.')
    if (mission.status === 'locked')
      throw new Error('Missão ainda está bloqueada.')

    // Verificar duplicidade de XP
    const weekKey = mission.weekKey
    const alreadyRewarded = XPHistoryRepository.alreadyRewarded(profileId, missionId, weekKey)
    if (alreadyRewarded && !mission.isRepeatable)
      throw new Error('Esta missão já foi recompensada.')

    // Concluir missão
    MissionRepository.updateStatus(missionId, 'completed')
    UserProgressRepository.markMissionComplete(profileId, missionId)

    // Conceder XP
    const xpEntry: XPHistory = {
      id: nanoid(),
      profileId,
      missionId,
      sourceId: weekKey ? `${missionId}:${weekKey}` : missionId,
      amount: mission.rewardXp,
      reason: `Missão concluída: ${mission.title}`,
      createdAt: new Date().toISOString(),
    }
    XPHistoryRepository.add(xpEntry)
    UserProgressRepository.addXp(profileId, mission.rewardXp)

    // Verificar se o nível pode avançar (missão principal concluída)
    let levelAdvanced = false
    let journeyCompleted = false

    if (mission.type === 'main') {
      const level = LevelRepository.findById(mission.levelId)
      if (level) {
        LevelRepository.complete(level.id)
        levelAdvanced = true

        // Calcular progresso da jornada
        const allLevels = LevelRepository.findByJourney(journey.id)
        const completedCount = allLevels.filter(l => l.status === 'completed').length
        const journeyProgress = Math.round((completedCount / allLevels.length) * 100)
        const financialProgress = journey.targetAmount > 0
          ? Math.min(100, (journey.accumulatedAmount / journey.targetAmount) * 100)
          : 0
        JourneyRepository.updateProgress(journey.id, journeyProgress, financialProgress)

        // Verificar se a jornada foi concluída
        if (completedCount === allLevels.length) {
          JourneyRepository.updateStatus(journey.id, 'completed')
          journeyCompleted = true

          // Bônus de conclusão
          XPHistoryRepository.add({
            id: nanoid(),
            profileId,
            missionId: 'journey_completed',
            sourceId: journey.id,
            amount: 500,
            reason: `Jornada concluída: ${journey.title}`,
            createdAt: new Date().toISOString(),
          })
          UserProgressRepository.addXp(profileId, 500)
        } else {
          // Desbloquear próximo nível
          const nextLevel = allLevels.find(l => l.order === level.order + 1)
          if (nextLevel) {
            LevelRepository.save({ ...nextLevel, status: 'in_progress' })

            // Atualizar currentLevelId
            const updatedJourney = JourneyRepository.findById(journey.id)!
            updatedJourney.currentLevelId = nextLevel.id
            JourneyRepository.save(updatedJourney)

            // Desbloquear missões do próximo nível
            const nextMissions = MissionRepository.findByLevel(nextLevel.id)
            for (const m of nextMissions) {
              MissionRepository.save({ ...m, status: 'available' })
            }
          }
        }
      }
    }

    return {
      mission: MissionRepository.findById(missionId)!,
      xpGained: mission.rewardXp,
      levelAdvanced,
      journeyCompleted,
    }
  },

  /** Atualiza o valor acumulado para calcular progresso financeiro */
  updateAccumulatedAmount(profileId: PersonaId, journeyId: string, amount: number): Journey {
    const journey = JourneyRepository.findById(journeyId)
    if (!journey || journey.profileId !== profileId)
      throw new Error('Jornada não encontrada.')
    if (amount < 0) throw new Error('Valor acumulado não pode ser negativo.')

    return JourneyRepository.updateAccumulated(journeyId, amount) ?? journey
  },

  /** Retorna o histórico de XP do usuário */
  getXpHistory(profileId: PersonaId): XPHistory[] {
    return XPHistoryRepository.findByPersona(profileId)
  },
}
