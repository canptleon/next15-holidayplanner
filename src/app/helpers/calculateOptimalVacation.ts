import dayjs from "dayjs";

export interface HolidayEntry {
  date: string;
  name: string;
  type: "full" | "half";
}

export interface VacationBlock {
  startDate: string;
  endDate: string;
  leaveDaysUsed: string[];
  totalVacationDays: number;
  efficiency: number;
}

export interface VacationPlan {
  blocks: VacationBlock[];
  totalVacationDays: number;
  totalLeaveDaysUsed: number;
  efficiency: number;
}

type Opportunity = {
  startIdx: number;
  endIdx: number;
  startDate: string;
  endDate: string;
  leaveDaysUsed: string[];
  leaveCount: number;
  totalDays: number;
  efficiency: number;
};

export function calculateOptimalVacationPlans(
  year: number,
  leaveDays: number,
  holidayData: HolidayEntry[],
  /** Only generate plans whose leave days start on or after this date (YYYY-MM-DD).
   *  Defaults to Jan 1 of the given year (no cutoff). */
  cutoffDate?: string
): VacationPlan[] {
  if (leaveDays <= 0) return [];

  const startOfYear = dayjs(`${year}-01-01`);
  const endOfYear = dayjs(`${year}-12-31`);
  const daysInYear = endOfYear.diff(startOfYear, "day") + 1;

  // ── 1. Build free-day set ──────────────────────────────────────────────────
  const freeDays = new Set<string>();

  for (let i = 0; i < daysInYear; i++) {
    const d = startOfYear.add(i, "day");
    if (d.day() === 0 || d.day() === 6) freeDays.add(d.format("YYYY-MM-DD"));
  }

  // Both full and half-day holidays are treated as free for bridging.
  // (Turkish "arife" days are de-facto full days off.)
  for (const h of holidayData) {
    freeDays.add(h.date);
  }

  // ── 2. Build indexed day array ─────────────────────────────────────────────
  const days: { date: string; isFree: boolean }[] = [];
  for (let i = 0; i < daysInYear; i++) {
    const d = startOfYear.add(i, "day");
    const dateStr = d.format("YYYY-MM-DD");
    days.push({ date: dateStr, isFree: freeDays.has(dateStr) });
  }

  const cutoff = cutoffDate ?? `${year}-01-01`;

  // ── 3. Exhaustive opportunity scan ────────────────────────────────────────
  // A window [s..e]: starts and ends on a free day, workdays in between = leave.
  const opportunities: Opportunity[] = [];

  for (let s = 0; s < daysInYear; s++) {
    if (!days[s].isFree) continue;

    let leaveCount = 0;
    const currentLeaveDays: string[] = [];

    for (let e = s + 1; e < daysInYear; e++) {
      if (!days[e].isFree) {
        leaveCount++;
        currentLeaveDays.push(days[e].date);
        if (leaveCount > leaveDays) break;
      } else {
        if (leaveCount > 0) {
          // Apply cutoff: first leave day must be on or after cutoffDate
          if (currentLeaveDays[0] >= cutoff) {
            const totalDays = e - s + 1;
            opportunities.push({
              startIdx: s,
              endIdx: e,
              startDate: days[s].date,
              endDate: days[e].date,
              leaveDaysUsed: [...currentLeaveDays],
              leaveCount,
              totalDays,
              efficiency: totalDays / leaveCount,
            });
          }
        }
      }
    }
  }

  // Sort: best efficiency first, then most total days as tiebreaker
  opportunities.sort(
    (a, b) => b.efficiency - a.efficiency || b.totalDays - a.totalDays
  );

  // ── 4. Generate diverse plans ──────────────────────────────────────────────
  const plans: VacationPlan[] = [];
  const seenPlanKeys = new Set<string>();
  const seenLeaveKeys = new Set<string>(); // deduplicate plans that use identical leave-day sets
  const maxAnchors = Math.min(opportunities.length, 150);

  for (let ai = 0; ai < maxAnchors; ai++) {
    const anchor = opportunities[ai];
    if (anchor.leaveCount > leaveDays) continue;

    const usedOpps: Opportunity[] = [anchor];
    const usedLeaveSet = new Set<string>(anchor.leaveDaysUsed);
    let remainingLeave = leaveDays - anchor.leaveCount;

    for (const opp of opportunities) {
      if (remainingLeave <= 0) break;
      if (opp.leaveCount > remainingLeave) continue;
      if (usedOpps.includes(opp)) continue;

      const hasLeaveConflict = opp.leaveDaysUsed.some((d) => usedLeaveSet.has(d));
      if (hasLeaveConflict) continue;

      // Strict range overlap — adjacent (sharing only a boundary free day) is OK
      const rangeOverlap = usedOpps.some(
        (b) => opp.startIdx < b.endIdx && opp.endIdx > b.startIdx
      );
      if (rangeOverlap) continue;

      usedOpps.push(opp);
      opp.leaveDaysUsed.forEach((d) => usedLeaveSet.add(d));
      remainingLeave -= opp.leaveCount;
    }

    usedOpps.sort((a, b) => a.startIdx - b.startIdx);

    const planKey = usedOpps.map((o) => `${o.startDate}~${o.endDate}`).join("|");
    if (seenPlanKeys.has(planKey)) continue;
    seenPlanKeys.add(planKey);

    // Skip plans whose leave-day set is identical to an already-added plan.
    // This prevents showing 10 "same green days" plans that only differ in
    // which free-day boundary anchors the block (e.g. after adding mandatory days).
    const leaveKey = [...usedLeaveSet].sort().join(",");
    if (seenLeaveKeys.has(leaveKey)) continue;
    seenLeaveKeys.add(leaveKey);

    const totalLeaveDaysUsed = usedOpps.reduce((s, o) => s + o.leaveCount, 0);
    const totalVacationDays = usedOpps.reduce((s, o) => s + o.totalDays, 0);

    plans.push({
      blocks: usedOpps.map((o) => ({
        startDate: o.startDate,
        endDate: o.endDate,
        leaveDaysUsed: o.leaveDaysUsed,
        totalVacationDays: o.totalDays,
        efficiency: o.efficiency,
      })),
      totalVacationDays,
      totalLeaveDaysUsed,
      efficiency: totalLeaveDaysUsed > 0 ? totalVacationDays / totalLeaveDaysUsed : 0,
    });

    if (plans.length >= 20) break;
  }

  plans.sort(
    (a, b) =>
      b.totalVacationDays - a.totalVacationDays ||
      b.efficiency - a.efficiency
  );

  return plans.slice(0, 10);
}
