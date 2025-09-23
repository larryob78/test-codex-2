export default function GeneratedGallery({ result, isSubmitting, format }) {
  if (isSubmitting) {
    return <p className="info">Generating assets…</p>;
  }

  if (!result) {
    return <p className="info">Generated creatives will appear here.</p>;
  }

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h3>Output preview</h3>
        {result.mock && <span className="badge">Mock mode</span>}
      </div>
      <p className="prompt">{result.prompt}</p>
      <div className="gallery-grid">
        {result.results.map((size) => (
          <div key={size.id} className="gallery-card">
            <header>
              <strong>{size.label}</strong>
              <span>
                {size.width} × {size.height}
              </span>
            </header>
            <div className="image-grid">
              {size.images.map((image) => (
                <figure key={image.variation}>
                  <img src={image.dataUri} alt={`${size.label} variation ${image.variation}`} />
                  <figcaption>
                    Variation {image.variation}{' '}
                    <a href={image.dataUri} download={`${size.id}-v${image.variation}.${format}`}>
                      Download
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
