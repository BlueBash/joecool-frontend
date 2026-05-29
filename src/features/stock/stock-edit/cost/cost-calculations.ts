/** Pure cost-price calculation chain (legacy CostPricesTab). Monetary steps use 4 dp unless noted. */

export type CostCalcInputs = {
  factPrice: number;
  factPer: number;
  factyAmount: number;
  factCardCost: number;
  fobComm: number;
  agentPackPct: number;
  fobQuality: number;
  fobProblems: number;
  fobCharge: number;
  fobAdminCharge: number;
  jcPackingCost: number;
  freight: number;
  factExchRate: number;
  buyAdjust: number;
  ukDuty: number;
  ukClearance: number;
  ukDelivery: number;
  assemblyCost: number;
  displayCost: number;
  gbpWhlsl: number;
};

export type CostCalcResults = {
  firstCost: number;
  factyInvd: number;
  agentBase: number;
  agentAmount: number;
  agentCost: number;
  agentPackAmount: number;
  fobBase: number;
  qualityAmount: number;
  probsAmount: number;
  chargesAmount: number;
  fobChargesAmount: number;
  itemOb: number;
  jcObCost: number;
  freightAmount: number;
  arriveUk: number;
  calcFobX: number;
  effectiveRate: number;
  upGbp: number;
  ukDutyAmount: number;
  dutyPaid: number;
  clearanceAmount: number;
  ukLanded: number;
  deliveryAmount: number;
  delivered: number;
  assembled: number;
  calcReady: number;
  roundedUp: number;
  landedFactor: number;
  calcdMarkup: number;
};

function round4(n: number): number {
  const v = Number.isFinite(n) ? n : 0;
  return Number(v.toFixed(4));
}

function round2(n: number): number {
  const v = Number.isFinite(n) ? n : 0;
  return Number(v.toFixed(2));
}

function pctOf(base: number, pct: number): number {
  return round4((base * pct) / 100);
}

export function computeCostPrices(input: CostCalcInputs): CostCalcResults {
  const factPer = input.factPer || 1;
  const factExchRate = input.factExchRate || 1;

  const firstCost = round4(input.factPrice / factPer);
  const factyInvd = round4(firstCost + input.factyAmount);
  const agentBase = round4(factyInvd + input.factCardCost);
  const agentAmount = pctOf(agentBase, input.fobComm);
  const agentCost = round4(agentBase + agentAmount);
  const agentPackAmount = pctOf(agentCost, input.agentPackPct);
  const fobBase = round4(agentCost + agentPackAmount);
  const qualityAmount = pctOf(fobBase, input.fobQuality);
  const probsAmount = pctOf(fobBase, input.fobProblems);
  const chargesAmount = pctOf(fobBase, input.fobCharge);
  const fobChargesAmount = pctOf(fobBase, input.fobAdminCharge);
  const itemOb = round4(
    fobBase + qualityAmount + probsAmount + chargesAmount + fobChargesAmount,
  );
  const jcObCost = round4(input.jcPackingCost + itemOb);
  const freightAmount = pctOf(jcObCost, input.freight);
  const arriveUk = round4(jcObCost + freightAmount);
  const calcFobX = round2(firstCost > 0 ? itemOb / firstCost : 0);

  const effectiveRate = Number(
    (factExchRate + (factExchRate * input.buyAdjust) / 100).toFixed(6),
  );
  const upGbp = round4(effectiveRate > 0 ? arriveUk / effectiveRate : 0);

  const ukDutyAmount = pctOf(upGbp, input.ukDuty);
  const dutyPaid = round4(upGbp + ukDutyAmount);
  const clearanceAmount = pctOf(dutyPaid, input.ukClearance);
  const ukLanded = round4(dutyPaid + clearanceAmount);
  const deliveryAmount = pctOf(ukLanded, input.ukDelivery);
  const delivered = round4(ukLanded + deliveryAmount);
  const assembled = round4(delivered + input.assemblyCost);
  const calcReady = round4(assembled + input.displayCost);
  const roundedUp = Math.ceil(calcReady * 100) / 100;

  const denom = firstCost / factExchRate;
  const landedFactor = denom > 0 ? round4(calcReady / denom) : 0;

  const storedReady = roundedUp;
  const calcdMarkup =
    storedReady > 0
      ? round2(((input.gbpWhlsl - storedReady) * 100) / storedReady)
      : 0;

  return {
    firstCost,
    factyInvd,
    agentBase,
    agentAmount,
    agentCost,
    agentPackAmount,
    fobBase,
    qualityAmount,
    probsAmount,
    chargesAmount,
    fobChargesAmount,
    itemOb,
    jcObCost,
    freightAmount,
    arriveUk,
    calcFobX,
    effectiveRate,
    upGbp,
    ukDutyAmount,
    dutyPaid,
    clearanceAmount,
    ukLanded,
    deliveryAmount,
    delivered,
    assembled,
    calcReady,
    roundedUp,
    landedFactor,
    calcdMarkup,
  };
}
