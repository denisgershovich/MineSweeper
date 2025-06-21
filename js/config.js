const GAME_CONFIG = {
  LEVELS: {
    beginner: {
      size: 4,
      mines: 2,
      name: "Beginner",
      description: "4×4 grid with 2 mines",
    },
    medium: {
      size: 8,
      mines: 12,
      name: "Medium",
      description: "8×8 grid with 12 mines",
    },
    expert: {
      size: 12,
      mines: 30,
      name: "Expert",
      description: "12×12 grid with 30 mines",
    },
  },

  EMOJIS: {
    MINE: "💣",
    LIVES: "💖",
    FLAG: "🚩",
    SMILE: "😊",
    LOSE: "😵",
    WIN: "😎",
  },

  SETTINGS: {
    INITIAL_LIVES: 3,
    ANIMATION_DURATION: 500,
    TIMER_INTERVAL: 100,
    MAX_MINE_PLACEMENT_ATTEMPTS: 10,
    GAME_OVER_ANIMATION_DURATION: 2000,
  },

  UI: {
    CELL_SIZE: {
      desktop: 40,
      mobile: 30,
    },
    FONT_SIZE: {
      desktop: 18,
      mobile: 14,
    },
    BREAKPOINT: 600,
  },

  ACCESSIBILITY: {
    SCREEN_READER_UPDATE_DELAY: 100,
    KEYBOARD_NAVIGATION_ENABLED: true,
    FOCUS_INDICATOR_COLOR: "#007acc",
  },

  STORAGE: {
    GAME_STATS: "minesweeper-stats",
    GAME_PREFERENCES: "minesweeper-preferences",
  },

  DEFAULT_PREFERENCES: {
    soundEnabled: false,
    animationsEnabled: true,
    highContrastMode: false,
    reducedMotion: false,
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GAME_CONFIG;
}
