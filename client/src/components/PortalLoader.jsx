export const PortalLoader = ({
  label = 'Opening the portal...',
  compact = false
}) => {
  return (
    <div className={`portal-loader-wrap ${compact ? 'compact' : ''}`} role="status" aria-live="polite">
      <div className="portal-loader-orb" aria-hidden="true">
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
        <span className="core" />
      </div>
      <p className="portal-loader-label">{label}</p>
    </div>
  );
};
