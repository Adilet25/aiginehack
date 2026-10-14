import PageHeader from '../components/shared/PageHeader'
import StoneWorkshop from '../workshop/StoneWorkshop'
import { useLang } from '../app/providers/LanguageProvider'

export default function StoneWorkshopPage() {
  const { t } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t.stoneWorkshopTitle}
        subtitle={t.stoneWorkshopSubtitle}
      />
      <StoneWorkshop />
    </div>
  )
}
