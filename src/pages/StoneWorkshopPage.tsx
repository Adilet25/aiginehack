import PageHeader from '../components/shared/PageHeader'
import StoneWorkshop from '../workshop/StoneWorkshop'
import { useLang } from '../app/providers/LanguageProvider'
import { useInterfaceCopy } from '../data/interface'

export default function StoneWorkshopPage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
  return (
    <div className="muras-workshop space-y-6">
      <PageHeader
        title={t.stoneWorkshopTitle}
        subtitle={t.stoneWorkshopSubtitle}
        action={{ to: '/community-gallery', label: c.browse }}
      />
      <StoneWorkshop />
    </div>
  )
}
