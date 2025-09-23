function SizeList({ title, items, selectedIds, onToggle }) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="size-section">
      <h3>{title}</h3>
      <div className="size-grid">
        {items.map((item) => {
          const checked = selectedIds.includes(item.id);
          return (
            <label key={item.id} className={checked ? 'size-card selected' : 'size-card'}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
              />
              <div>
                <strong>{item.label}</strong>
                <p>
                  {item.width} × {item.height}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function SizeSelector({ presets = [], customSizes = [], selectedIds, onToggle, loading }) {
  if (loading) {
    return <p>Loading presets…</p>;
  }

  if (presets.length === 0 && customSizes.length === 0) {
    return <p className="info">No sizes available yet. Add a custom size to begin.</p>;
  }

  return (
    <div className="size-selector">
      <SizeList title="Preset sizes" items={presets} selectedIds={selectedIds} onToggle={onToggle} />
      <SizeList
        title="Custom sizes"
        items={customSizes}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </div>
  );
}
