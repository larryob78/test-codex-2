const SIZE_PRESETS = [
  {
    id: 'bulletin-billboard',
    label: "Bulletin Billboard (14' x 48')",
    width: 6720,
    height: 2016,
    description: 'High-impact roadside billboard for highways and expressways.',
  },
  {
    id: 'digital-spectacular',
    label: 'Digital Spectacular (1080 x 1920)',
    width: 1080,
    height: 1920,
    description: 'Portrait digital billboard for urban cores and malls.',
  },
  {
    id: 'bus-shelter',
    label: 'Bus Shelter Poster (1200 x 1800)',
    width: 1200,
    height: 1800,
    description: 'Transit shelter poster for pedestrian engagement.',
  },
  {
    id: 'street-banner',
    label: 'Street Pole Banner (900 x 2400)',
    width: 900,
    height: 2400,
    description: 'Double-sided pole banner for seasonal campaigns.',
  },
  {
    id: 'transit-side',
    label: 'Transit Bus King (2400 x 800)',
    width: 2400,
    height: 800,
    description: 'Side panel wrap for buses, trams, and shuttles.',
  },
  {
    id: 'wallscape',
    label: 'Building Wallscape (4000 x 4000)',
    width: 4000,
    height: 4000,
    description: 'Large square installation for building walls.',
  },
];

const SUPPORTED_FORMATS = ['png', 'jpeg', 'webp'];

module.exports = {
  SIZE_PRESETS,
  SUPPORTED_FORMATS,
};
