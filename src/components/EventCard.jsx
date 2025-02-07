export default function EventCard({
  title,
  startY,
  startX,
  endX,
  bg,
  startTime,
  endTime,
  onCardClick,
  onMouseDown,
}) {
  return (
    <div
      className="event-card"
      tabIndex={0}
      style={{
        backgroundColor: bg,
        top: startY,
        left: Math.min(startX, endX),
        width: Math.abs(endX - startX),
      }}
      // tabIndex={0}
      onKeyDown={(e) => {
        console.log("Key pressed:", e.key, e.keyCode); // Debug log
        if (
          (e.key === "Delete" || e.key === "Backspace" || e.keyCode === 46) &&
          onCardClick
        ) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Delete action triggered"); // Debug log
          onCardClick();
        }
      }}
      onMouseDown={onMouseDown}
    >
      <div className="event-title">
        {title}
        {onCardClick && (
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick();
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className="event-time">
        {startTime} - {endTime}
      </div>
    </div>
  );
}
