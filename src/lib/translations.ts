export type Lang = "tr" | "en";

export interface TranslationMap {
  siteTitle: string;
  homeTagline: string;
  homeInputLabel: string;
  homeInputPlaceholder: string;
  homeSubmitBtn: string;
  homeDisclaimer: string;
  homeValidationError: string;
  calendarTitle: string;
  calendarSubtitle: (count: number, days: number) => string;
  publicHolidays: string;
  halfDays: string;
  weekendDays: string;
  changeLeaveDays: string;
  planLabel: string;
  best: string;
  daysOff: string;
  leaveArrow: string;
  daysWord: string;
  efficiencyLabel: string;
  unusedLeave: (n: number) => string;
  blockLabel: (n: number) => string;
  leaveUsedLabel: string;
  effLabel: string;
  leaveDatesBadge: string;
  legendTitle: string;
  legendLeaveDay: string;
  legendVacationBlock: string;
  legendPublicHoliday: string;
  legendHalfDay: string;
  legendWeekend: string;
  legendPast: string;
  leaveDayTooltip: string;
  weekdayLabels: string[];
  langLabel: string;
}

const tr: TranslationMap = {
  siteTitle: "Tatil Planlayıcı",
  homeTagline: "İzin günlerinizi hafta sonları ve resmi tatillerle birleştirerek maksimum tatil yapın.",
  homeInputLabel: "Kaç günlük izin hakkınız var?",
  homeInputPlaceholder: "Örn: 10",
  homeSubmitBtn: "En İyi Planları Bul",
  homeDisclaimer: "2026 Türkiye resmi tatillerine göre hesaplanır",
  homeValidationError: "Lütfen 1 ile 30 arasında bir sayı giriniz.",
  calendarTitle: "2026 İzin Planlayıcı",
  calendarSubtitle: (count, days) => `${days} izin günü için ${count} plan bulundu`,
  publicHolidays: "resmi tatil",
  halfDays: "yarım gün",
  weekendDays: "hafta sonu günü",
  changeLeaveDays: "İzin Günü Değiştir",
  planLabel: "Plan",
  best: "En İyi",
  daysOff: "gün tatil",
  leaveArrow: "izin",
  daysWord: "gün",
  efficiencyLabel: "verimlilik",
  unusedLeave: (n) => `+${n} izin günü kullanılmadı`,
  blockLabel: (n) => `Blok ${n}`,
  leaveUsedLabel: "izin kullanıldı",
  effLabel: "verimlilik",
  leaveDatesBadge: "İzin günleri",
  legendTitle: "Renk Göstergesi",
  legendLeaveDay: "İzin Günü",
  legendVacationBlock: "Tatil Dönemi",
  legendPublicHoliday: "Resmi Tatil",
  legendHalfDay: "Yarım Gün Tatil",
  legendWeekend: "Hafta Sonu",
  legendPast: "Geçmiş",
  leaveDayTooltip: "İzin Günü",
  weekdayLabels: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"],
  langLabel: "EN",
};

const en: TranslationMap = {
  siteTitle: "Holiday Planner",
  homeTagline: "Maximize your time off by combining leave days with weekends and public holidays.",
  homeInputLabel: "How many leave days do you have?",
  homeInputPlaceholder: "e.g. 10",
  homeSubmitBtn: "Find Best Plans",
  homeDisclaimer: "Based on 2026 Turkish public holidays",
  homeValidationError: "Please enter a number between 1 and 30.",
  calendarTitle: "2026 Leave Planner",
  calendarSubtitle: (count, days) =>
    `${count} plans found for ${days} leave day${days !== 1 ? "s" : ""}`,
  publicHolidays: "public holidays",
  halfDays: "half-days",
  weekendDays: "weekend days",
  changeLeaveDays: "Change Leave Days",
  planLabel: "Plan",
  best: "Best",
  daysOff: "days off",
  leaveArrow: "leave",
  daysWord: "days",
  efficiencyLabel: "efficiency",
  unusedLeave: (n) => `+${n} leave day${n !== 1 ? "s" : ""} unused`,
  blockLabel: (n) => `Block ${n}`,
  leaveUsedLabel: "leave used",
  effLabel: "efficiency",
  leaveDatesBadge: "Leave days",
  legendTitle: "Legend",
  legendLeaveDay: "Leave Day",
  legendVacationBlock: "Vacation Block",
  legendPublicHoliday: "Public Holiday",
  legendHalfDay: "Half-day Holiday",
  legendWeekend: "Weekend",
  legendPast: "Past",
  leaveDayTooltip: "Leave Day",
  weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  langLabel: "TR",
};

export const translations: Record<Lang, TranslationMap> = { tr, en };
