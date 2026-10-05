export type Memory = {
  image: string
  alt: string
  caption: string
  note?: string
  composition: 'wide' | 'quiet' | 'close'
}

export const giftContent = {
  recipient: 'Ravi Shankar Jha',
  sender: 'Manu',
  birthdayDate: '11th NOV',
  password: 'birthday',
  openingLine: 'A big birthday hug, a few happy memories, and a little surprise.',
  note: [
    '[Add a first line that sounds like you.]',
    '[A favorite shared story, in your own words.]',
    '[The thing you want him to remember long after today.]',
  ],
  video: {
    src: '',
    poster: '/memory-evening.png',
    title: 'A little film',
    description: 'Hit play for your very own birthday mini-movie.',
  },
  memories: [
    {
      image: '/memory-evening.png',
      alt: 'A bright backyard birthday table with cake, balloons, and confetti',
      caption: '[A moment you still think about]',
      note: '[Add a date, an inside joke, or leave this one without a caption.]',
      composition: 'wide',
    },
    {
      image: '/memory-window.png',
      alt: 'A sunny road trip view with a balloon ribbon in the car window',
      caption: '[Somewhere the two of you have been]',
      composition: 'quiet',
    },
    {
      image: '/memory-table.png',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
  ] satisfies Memory[],
  signoff: '[Your sign-off]',
  videoUrl: '',
  musicUrl: '',
}

export type GiftContent = typeof giftContent
