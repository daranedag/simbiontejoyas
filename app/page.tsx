import App from '../src/App'
import { getPublicSiteContent } from '../lib/cms'

export const revalidate = 60

export default async function HomePage() {
  const content = await getPublicSiteContent()
  return <App content={content} />
}
