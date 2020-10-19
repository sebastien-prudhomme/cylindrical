import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default async ({ store }) => {
  const agent = await FingerprintJS.load()
  const result = await agent.get()

  await store.dispatch('fingerprint/setVisitorId', { visitorId: result.visitorId })
}
