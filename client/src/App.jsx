import { useEffect, useMemo, useState } from 'react';
import { generateCreatives } from './lib/api.js';
import { usePresets } from './hooks/usePresets.js';
import GeneratedGallery from './components/GeneratedGallery.jsx';
import SizeSelector from './components/SizeSelector.jsx';
import FormatSelector from './components/FormatSelector.jsx';
import './styles/app.css';

const initialForm = {
  campaignName: '',
  primaryText: '',
  secondaryText: '',
  callToAction: '',
  brandColors: '',
  visualStyle: 'High-impact outdoor photography with bold typography',
  background: 'City skyline at dusk',
  format: 'png',
  variationCount: 1,
};

export default function App() {
  const { sizes, formats, loading: loadingPresets, error: presetError } = usePresets();
  const [form, setForm] = useState(initialForm);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [customSize, setCustomSize] = useState({ label: '', width: '', height: '' });
  const [customSizes, setCustomSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (sizes.length > 0 && selectedSizeIds.length === 0) {
      setSelectedSizeIds([sizes[0].id]);
    }
  }, [sizes, selectedSizeIds.length]);

  const availableFormats = useMemo(() => {
    if (formats.includes(form.format)) {
      return formats;
    }
    return formats.length ? formats : ['png', 'jpeg', 'webp'];
  }, [formats, form.format]);

  const allSizes = useMemo(() => [...sizes, ...customSizes], [sizes, customSizes]);

  const selectedSizes = useMemo(() => {
    return allSizes.filter((preset) => selectedSizeIds.includes(preset.id));
  }, [allSizes, selectedSizeIds]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSize = (sizeId) => {
    setSelectedSizeIds((prev) =>
      prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]
    );
  };

  const handleCustomSizeChange = (event) => {
    const { name, value } = event.target;
    setCustomSize((prev) => ({ ...prev, [name]: value }));
  };

  const addCustomSize = () => {
    setError('');
    if (!customSize.label || !customSize.width || !customSize.height) {
      setError('Provide a label, width, and height for the custom size.');
      return;
    }
    const width = parseInt(customSize.width, 10);
    const height = parseInt(customSize.height, 10);
    if (Number.isNaN(width) || Number.isNaN(height) || width <= 0 || height <= 0) {
      setError('Custom size width and height must be positive integers.');
      return;
    }
    const newSize = {
      id: `custom-${Date.now()}`,
      label: customSize.label,
      width,
      height,
    };
    setCustomSizes((prev) => [...prev, newSize]);
    setSelectedSizeIds((prev) => [...prev, newSize.id]);
    setCustomSize({ label: '', width: '', height: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        variationCount: Number(form.variationCount) || 1,
        sizes: selectedSizes.map((size) => ({
          id: size.id,
          label: size.label,
          width: size.width,
          height: size.height,
        })),
      };

      if (payload.sizes.length === 0) {
        throw new Error('Select at least one size to generate.');
      }

      const response = await generateCreatives(payload);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Sedncae Outdoor Ad Studio</h1>
          <p>Design billboard-ready visuals across multiple formats using the Sedncae 4.0 model.</p>
        </div>
        <div className="status-pill">{isSubmitting ? 'Generating…' : 'Ready'}</div>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Creative Brief</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Campaign name
              <input
                type="text"
                name="campaignName"
                value={form.campaignName}
                onChange={handleInputChange}
                placeholder="Q4 Smart City Launch"
                required
              />
            </label>

            <label>
              Primary message
              <input
                type="text"
                name="primaryText"
                value={form.primaryText}
                onChange={handleInputChange}
                placeholder="Experience the future of urban mobility"
                required
              />
            </label>

            <label>
              Supporting message
              <input
                type="text"
                name="secondaryText"
                value={form.secondaryText}
                onChange={handleInputChange}
                placeholder="Powered by Sedncae 4.0 intelligence"
              />
            </label>

            <label>
              Call to action
              <input
                type="text"
                name="callToAction"
                value={form.callToAction}
                onChange={handleInputChange}
                placeholder="Book your media now"
              />
            </label>

            <label>
              Visual style
              <textarea
                name="visualStyle"
                value={form.visualStyle}
                onChange={handleInputChange}
                rows={3}
              />
            </label>

            <label>
              Background inspiration
              <input
                type="text"
                name="background"
                value={form.background}
                onChange={handleInputChange}
                placeholder="Nighttime skyline with traffic light trails"
              />
            </label>

            <label>
              Brand colors
              <input
                type="text"
                name="brandColors"
                value={form.brandColors}
                onChange={handleInputChange}
                placeholder="#0f172a, #38bdf8"
              />
            </label>

            <FormatSelector
              value={form.format}
              options={availableFormats}
              onChange={(value) => setForm((prev) => ({ ...prev, format: value }))}
            />

            <label className="inline">
              Variations per size
              <input
                type="number"
                min="1"
                max="4"
                name="variationCount"
                value={form.variationCount}
                onChange={handleInputChange}
              />
            </label>

            <button type="submit" disabled={isSubmitting || loadingPresets}>
              {isSubmitting ? 'Generating…' : 'Generate visuals'}
            </button>

            {error && <p className="error">{error}</p>}
            {presetError && <p className="error">{presetError}</p>}
          </form>
        </section>

        <section className="panel">
          <h2>Sizes & Outputs</h2>
          <SizeSelector
            presets={sizes}
            customSizes={customSizes}
            selectedIds={selectedSizeIds}
            onToggle={toggleSize}
            loading={loadingPresets}
          />

          <div className="custom-size">
            <h3>Add custom size</h3>
            <div className="custom-size-grid">
              <input
                type="text"
                name="label"
                value={customSize.label}
                onChange={handleCustomSizeChange}
                placeholder="Airport lightbox"
              />
              <input
                type="number"
                name="width"
                value={customSize.width}
                onChange={handleCustomSizeChange}
                placeholder="Width px"
                min="1"
              />
              <input
                type="number"
                name="height"
                value={customSize.height}
                onChange={handleCustomSizeChange}
                placeholder="Height px"
                min="1"
              />
              <button type="button" onClick={addCustomSize}>
                Add size
              </button>
            </div>
          </div>

          <GeneratedGallery
            result={result}
            isSubmitting={isSubmitting}
            format={form.format}
          />
        </section>
      </main>
    </div>
  );
}
