export type NoteCard = {
  heading: string
  body: string
  footer: string
}

export type Memory = {
  image: string
  alt: string
  caption: string
  note?: string
  composition: 'wide' | 'quiet' | 'close'
}

export const giftContent = {
  recipient: 'RAVI SHANKAR JHA',
  sender: 'Manu',
  birthdayDate: '11th NOV',
  password: '',
  openingLine: 'A big birthday hug, a few happy memories, and a little surprise.',
  note: [
    {
      heading: 'To My Wonderful Husband',
      body: 'You are my best friend, my greatest confidant, and the love of my life. With you I have found my forever and my always.',
      footer: 'Happy Birthday My Love',
    },
    {
      heading: 'You Make Every Day Brighter',
      body: 'Your laugh, your kindness, the way you care for everyone around you I fall in love with you a little more every single day.',
      footer: 'Grateful for every moment with you.',
    },
    {
      heading: 'Here is to You, Today',
      body: 'On your birthday I want you to know how deeply you are loved, how endlessly you are admired, and how lucky I am to call you mine.',
      footer: 'With all my love, always and forever.',
    },
  ] satisfies NoteCard[],
  video: {
    src: '',
    poster: '/memory-evening.png',
    title: 'A little film',
    description: 'Hit play for your very own birthday mini-movie.',
  },
  memories: [
    {
      image: '/set2/10.jpeg',
      alt: 'Ravi standing at a high-altitude mountain summit in Leh, surrounded by snow-covered peaks',
      caption: 'On top of the world.',
      note: 'The mountains always call you back and you always answer.',
      composition: 'quiet',
    },
    {
      image: '/set2/8.jpeg',
      alt: 'Ravi sitting against a pine tree on a forested hillside, relaxed and looking into the distance',
      caption: 'Still. Peaceful. Yours.',
      note: 'Some moments were just for you and I love that about you.',
      composition: 'quiet',
    },
    {
      image: '/set3/12.jpeg',
      alt: 'Ravi and Manu taking a selfie at the beach with a golden sunset sky behind them',
      caption: 'Every sunset with you is my favourite.',
      note: 'The sky turned pink just for us that evening.',
      composition: 'quiet',
    },
    {
      image: '/set3/13.jpeg',
      alt: 'Ravi and Manu together under tall coconut palm trees in bright sunlight',
      caption: 'Somewhere warm, somewhere ours.',
      note: 'The light was perfect. So were you.',
      composition: 'quiet',
    },
    {
      image: '/set3/9.jpeg',
      alt: 'Ravi and Manu at a coastal rock formation with a natural stone arch and blue sea behind them',
      caption: 'The Andamans, us, and that arch.',
      note: 'On the rocks and smiled :)',
      composition: 'close',
    },
    {
      image: '/set3/8.jpeg',
      alt: 'Ravi in the foreground and Manu in a red dress standing on white sand beach at dusk',
      caption: 'The day everything changed.',
      note: '"Dad to be" and "Mom to be" what a chapter that was.',
      composition: 'close',
    },
    {
      image: '/set3/6.jpeg',
      alt: 'Ravi, Manu, and their baby together in matching red festive outfits',
      caption: 'Our little family, dressed in red.',
      note: 'The best thing we ever made together.',
      composition: 'close',
    },
    {
      image: '/set3/7.jpeg',
      alt: 'Ravi and Manu seated together in matching pink and yellow traditional outfits at a celebration',
      caption: 'Pink, yellow, and perfectly us.',
      note: 'Dressed alike, smiling alike some days are just made of joy.',
      composition: 'quiet',
    },
    {
      image: '/set1/9.jpeg',
      alt: 'Ravi, Manu, their baby, and mother together outside a temple during a festival',
      caption: 'Our family, at the temple.',
      note: 'Some blessings are best received together.',
      composition: 'quiet',
    },

    {
      image: '/set3/10.jpeg',
      alt: 'Ravi and Manu in matching Dad-to-be and Mom-to-be t-shirts, pregnancy announcement photo',
      caption: 'That beach... And Us',
      note: 'A picture I will keep forever ',
      composition: 'close',
    },
  ] satisfies Memory[],
  noteFooter: '',  // per-card footer is now inside each NoteCard
  signoff: 'Enjoy your day',
  videoUrl: '',
  musicUrl: '',
  // ── Per-page audio ──────────────────────────────────────────────────────
  // Drop an audio file in /public and set the path here.
  // Set pageAudioTrigger to the chapter where it should auto-play:
  //   'cover' | 'note' | 'film' | 'memories' | 'ending'
  // Leave pageAudioUrl empty to disable.
  pageAudioUrl: '',          // e.g. '/audio/happy-birthday.mp3'
  pageAudioTrigger: 'ending' as 'cover' | 'note' | 'film' | 'memories' | 'ending',
}

export type GiftContent = typeof giftContent
