import { Conditionals, ContentDefinition } from 'lib/conditionals/conditionalUtils'
import { ComputedStatsArray, Source } from 'lib/optimizer/computedStatsArray'
import { TsUtils } from 'lib/TsUtils'
import { SuperImpositionLevel } from 'types/LightCone'
import { LightConeConditional } from 'types/LightConeConditionals'
import { OptimizerAction, OptimizerContext } from 'types/Optimizer'

export default (s: SuperImpositionLevel, withContent: boolean): LightConeConditional => {
  const t = TsUtils.wrappedFixedT(withContent).get(null, 'conditionals', 'Lightcones.Mediation')

  const sValues = [12, 14, 16, 18, 20]

  const defaults = {
    initialSpdBuff: true,
  }

  const teammateDefaults = {
    initialSpdBuff: true,
  }

  const content: ContentDefinition<typeof defaults> = {
    initialSpdBuff: {
      lc: true,
      id: 'initialSpdBuff',
      formItem: 'switch',
      text: t('Content.initialSpdBuff.text'),
      content: t('Content.initialSpdBuff.content', { SpdBuff: sValues[s] }),
    },
  }

  const teammateContent: ContentDefinition<typeof teammateDefaults> = {
    initialSpdBuff: content.initialSpdBuff,
  }

  return {
    content: () => Object.values(content),
    teammateContent: () => Object.values(teammateContent),
    defaults: () => defaults,
    teammateDefaults: () => teammateDefaults,
    precomputeEffects: () => {
    },
    precomputeMutualEffects: (x: ComputedStatsArray, action: OptimizerAction, context: OptimizerContext) => {
      const m: Conditionals<typeof teammateContent> = action.lightConeConditionals

      x.SPD.buff((m.initialSpdBuff) ? sValues[s] : 0, Source.NONE)
    },
    finalizeCalculations: () => {
    },
  }
}
