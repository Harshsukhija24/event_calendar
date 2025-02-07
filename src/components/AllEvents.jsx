import EventCard from "./EventCard";

export default function AllEvents({
  events,
  selectedMonth,
  selectedYear,
  handleCardClick,
  handleEventDragStart,
  calculateRowHeight,
  headerHeight,
}) {
  return (
    <>
      {events.map(
        (event, i) =>
          !event.isDeleted &&
          event.month === selectedMonth &&
          event.year === selectedYear && (
            <EventCard
              key={i}
              title={event.title}
              startX={event.startX}
              endX={event.endX}
              bg={event.color}
              startY={
                event.rowNo * calculateRowHeight(event.rowNo) + headerHeight
              }
              startTime={event.startTime}
              endTime={event.endTime}
              onCardClick={() => handleCardClick(i)}
              onMouseDown={(e) => handleEventDragStart(e, i)}
            />
          )
      )}
    </>
  );
}
