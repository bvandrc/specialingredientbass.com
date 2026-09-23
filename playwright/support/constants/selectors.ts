export const SELECTORS = {
  HEADER: {
    LOGO: 'header-logo',
    BIO_AND_LINKS: 'header-bio-and-links',
  },
  GRID: {
    BODY: 'grid-body',
    MAIN_BODY: 'main-grid-body',
    NONE_EXPANDED_INFO: 'none-expanded-info',
    SOUNDCLOUD_MIXES_PROMPT: 'soundcloud-mixes-prompt',
    CARD: {
      SELF: 'grid-card',
      BODY: 'grid-card-body',
      TITLE: {
        SELF: 'grid-card-title',
        TEXT: 'grid-card-title-text',
        COLLAPSE_CARET: 'grid-card-title-collapse-caret',
      },
    },
    UP_ARROW: 'up-arrow',
    DOWN_ARROW: 'down-arrow',
  },
  SOUNDCLOUD: {
    TRACK: {
      SELF: 'soundcloud-track',
      TITLE: 'soundcloud-track-title',
      SUBTITLE: 'soundcloud-track-subtitle',
      ADDITIONAL_INFO: 'soundcloud-track-additional-info',
    },
    PLAYER: {
      SELF: 'soundcloud-player',
      PLAY_PAUSE_BUTTON: 'soundcloud-player-play-pause-button',
      STATS: 'soundcloud-player-stats',
      SC_LINK: 'soundcloud-player-sc-link',
    },
  },
} as const
