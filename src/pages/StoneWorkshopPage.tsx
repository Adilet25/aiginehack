import PageHeader from '../components/shared/PageHeader'
import StoneWorkshop from '../workshop/StoneWorkshop'

export default function StoneWorkshopPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stone Workshop"
        subtitle="Создай свой петроглиф, интерпретируй его и опубликуй в сообществе."
      />
      <StoneWorkshop />
    </div>
  )
}