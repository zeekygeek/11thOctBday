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
  password: 'birthday',
  openingLine: 'A big birthday hug, a few happy memories, and a little surprise.',
  note: [
    {
      heading: 'To My Wonderful Husband',
      body: 'You are my best friend, my greatest confidant, and the love of my life. With you I have found my forever and my always.',
      footer: 'Happy Birthday My Love',
    },
    {
      heading: 'You Make Every Day Brighter',
      body: 'Your laugh, your kindness, the way you care for everyone around you — I fall in love with you a little more every single day.',
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
      alt: 'A bright backyard birthday table with cake, balloons, and confetti',
      caption: '[A moment you still think about]',
      note: '[Add a date, an inside joke, or leave this one without a caption.]',
      composition: 'quiet',
    },
    {
      image: '/set2/8.jpeg',
      alt: 'A sunny road trip view with a balloon ribbon in the car window',
      caption: '[Somewhere the two of you have been]',
      composition: 'quiet',
    },
    {
      image: '/set3/12.jpeg',
      alt: 'A sunny road trip view with a balloon ribbon in the car window',
      caption: '[Somewhere the two of you have been]',
      composition: 'quiet',
    },
    {
      image: '/set3/13.jpeg',
      alt: 'A sunny road trip view with a balloon ribbon in the car window',
      caption: '[Somewhere the two of you have been]',
      composition: 'quiet',
    },
    {
      image: '/set3/9.jpeg',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
    {
      image: '/set3/8.jpeg',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
    {
      image: '/set3/6.jpeg',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
    {
      image: '/set3/10.jpeg',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
  ] satisfies Memory[],
  noteFooter: '',  // per-card footer is now inside each NoteCard
  signoff: '[Your sign-off]',
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
