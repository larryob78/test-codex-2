import CampaignCreator from '../../../components/campaign-creator';

export default function CampaignsPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campaigns</h1>
      <CampaignCreator />
    </div>
  );
}
