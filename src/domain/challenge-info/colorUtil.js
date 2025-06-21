// 챌린지 컬러 테마 매핑
export const COLOR_MAP = {
  RED: "#ff5a5a",
  ORANGE: "#ff9900",
  YELLOW: "#ffd600",
  GREEN: "#22c55e",
  SKYBLUE: "#38bdf8",
  BLUE: "#2563eb",
  PURPLE: "#a259ff",
  PINK: "#ff6fcb",
  GRAY: "#999999",
};

// 챌린지 단위 텍스트 반환
export function getUnitText(unit) {
  switch (unit) {
    case "DAILY": return "[ 일간 챌린지 ]";
    case "WEEKLY": return "[ 주간 챌린지 ]";
    case "MONTHLY": return "[ 월간 챌린지 ]";
    default: return null;
  }
} 