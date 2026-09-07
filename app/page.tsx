import App from '../src/App'
import { SiteConstruction } from '../components/site-construction'
import { getPublicSiteContent, getSiteVisibilityMode } from '../lib/cms'

export const revalidate = 60

export default async function HomePage() {
  const content = await getPublicSiteContent()

  if (getSiteVisibilityMode(content.texts) === 'construction') {
    return <SiteConstruction />
  }

  return <App content={content} />
}
