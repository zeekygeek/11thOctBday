import GiftExperience from './gift-experience'

export default function Page() {
  const password = process.env.NEXT_GIFT_PASSWORD || 'birthday'
  return <GiftExperience password={password} />
}
