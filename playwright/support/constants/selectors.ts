const testId = <S extends string>(testid: S) =>
  `[data-testid="${testid}"]` as const

export const SELECTORS = {
  HEADER: {
    LOGO: testId('header-logo'),
    BIO_AND_LINKS: testId('header-bio-and-links'),
  },
  GRID: {
    BODY: testId('grid-body'),
    MAIN_BODY: testId('main-grid-body'),
    NONE_EXPANDED_INFO: testId('none-expanded-info'),
    SOUNDCLOUD_MIXES_PROMPT: testId('soundcloud-mixes-prompt'),
    CARD: {
      SELF: testId('grid-card'),
      BODY: testId('grid-card-body'),
      TITLE: {
        SELF: testId('grid-card-title'),
        TEXT: testId('grid-card-title-text'),
        COLLAPSE_CARET: testId('grid-card-title-collapse-caret'),
      },
    },
    UP_ARROW: testId('up-arrow'),
    DOWN_ARROW: testId('down-arrow'),
  },
  SOUNDCLOUD: {
    TRACK: {
      SELF: testId('soundcloud-track'),
      TITLE: testId('soundcloud-track-title'),
      SUBTITLE: testId('soundcloud-track-subtitle'),
      ADDITIONAL_INFO: testId('soundcloud-track-additional-info'),
    },
    PLAYER: {
      SELF: testId('soundcloud-player'),
      PLAY_PAUSE_BUTTON: testId('soundcloud-player-play-pause-button'),
      STATS: testId('soundcloud-player-stats'),
      SC_LINK: testId('soundcloud-player-sc-link'),
    },
  },
} as const
