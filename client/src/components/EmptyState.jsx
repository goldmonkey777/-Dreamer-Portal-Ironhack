import { Link } from 'react-router-dom';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionTo,
  actionOnClick
}) => {
  return (
    <div className="empty-state mystic-panel">
      <div className="empty-state-icon" aria-hidden="true">◌</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionTo ? (
        <Link className="dp-btn" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
      {!actionTo && actionOnClick ? (
        <button className="dp-btn" type="button" onClick={actionOnClick}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};
