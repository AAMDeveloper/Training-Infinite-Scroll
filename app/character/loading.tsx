import './skeleton.css'

export default function CharacterSkeleton() {
  return (
    <div className="character-container">
      <div className="back-button skeleton-button" />

      <div className="character-detail">
        <div className="character-image">
          <div className="skeleton skeleton-image" />
        </div>

        <div className="character-info">
          <div className="skeleton skeleton-title" />

          <div className="info-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="info-item">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-text" style={{ marginTop: '0.5rem' }} />
              </div>
            ))}
          </div>

          <div className="episodes-section">
            <div className="skeleton skeleton-subtitle" />
            <ul className="episodes-list">
              {Array(12).fill(0).map((_, i) => (
                <li key={i} className="skeleton skeleton-episode" />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
