import type { SecurityEvent, RiskFactor, SecurityPosture, Category } from './types';

const BASE_SCORE = 100;

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Protected';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Elevated Risk';
  return 'Critical';
}

export function calculateRiskFactors(events: SecurityEvent[]): RiskFactor[] {
  return events
    .filter(e => e.status === 'new' || e.status === 'acknowledged')
    .map(e => ({
      id: `rf-${e.id}`,
      label: e.title,
      deduction: e.riskContribution,
      eventId: e.id,
      category: e.category,
    }));
}

export function calculatePosture(events: SecurityEvent[]): SecurityPosture {
  const activeEvents = events.filter(e => e.status === 'new' || e.status === 'acknowledged');
  
  const categoryScores: Record<Category, number> = {
    email: 100,
    identity: 100,
    network: 100,
    ehr: 100,
    system: 100,
    linkguard: 100,
    application: 100,
  };

  let totalDeductions = 0;
  const riskFactors: RiskFactor[] = [];

  activeEvents.forEach(e => {
    totalDeductions += Math.min(25, e.riskContribution);
    if (categoryScores[e.category] !== undefined) {
      categoryScores[e.category] = Math.max(20, categoryScores[e.category] - e.riskContribution);
    }
    riskFactors.push({
      id: `rf-${e.id}`,
      label: `${e.title} (${e.system})`,
      deduction: e.riskContribution,
      eventId: e.id,
      category: e.category,
    });
  });

  // Calculate weighted overall score
  const weights: Record<Category, number> = {
    email: 0.15,
    linkguard: 0.10,
    identity: 0.20,
    network: 0.15,
    application: 0.15,
    ehr: 0.25,
    system: 0.00,
  };

  let weightedSum = 0;
  let totalWeight = 0;
  (Object.keys(weights) as Category[]).forEach(cat => {
    weightedSum += (categoryScores[cat] ?? 100) * weights[cat];
    totalWeight += weights[cat];
  });

  const rawScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : BASE_SCORE;
  const score = Math.max(10, Math.min(100, rawScore));

  return {
    score,
    label: getScoreLabel(score),
    categoryScores,
    riskFactors: riskFactors.sort((a, b) => b.deduction - a.deduction),
    lastCalculated: new Date().toISOString(),
  };
}
