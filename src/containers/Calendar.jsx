import { useEffect, useState } from "react";

import eventColors from "../constants/eventColor";
import {
  COLUMN_WIDTH,
  HEADER_HEIGHT,
  RESOURCE_COLUMN_WIDTH,
  RESOURCES,
} from "../constants";

import EventCard from "../components/EventCard";
import Header from "../components/Header";
import TimelineTable from "../components/TimelineTable";
import Modal from "../components/Modal";
import AllEvents from "../components/AllEvents";

import "./index.css";

export default function Calendar() {
  const todaysDate = new Date();
  const savedEvents = localStorage.getItem("CALENDAR_EVENTS");

  // all events - array of object {startX, endX, rowNo, title, color, startTime, endTime, month, year} -
  const [events, setEvents] = useState([]);
  // All resources - array
  const [resources, setResources] = useState(RESOURCES);

  // selectedMonth and selectedYear is used for month and year which is selected from date picker / arrows in header
  const [selectedMonth, setSelectedMonth] = useState(todaysDate.getMonth()); // eg: 2
  const [selectedYear, setSelectedYear] = useState(todaysDate.getFullYear()); // eg: 2025

  // used to position event in timeline
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [rowNo, setRowNo] = useState(0);

  // to track dragging / mouse events
  const [isSelecting, setIsSelecting] = useState(false);
  const [draggedEventIndex, setDraggedEventIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // index of event that is selected for deletion
  const [deletePopupIndex, setDeletePopupIndex] = useState(null);

  // no of days in selected month, year
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // array of all days (with weekday) in selected month, year eg: ["1 Wed", "2 Thu"...]
  const daysOfMonthArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(selectedYear, selectedMonth, i + 1);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${i + 1} ${day}`;
  });

  useEffect(() => {
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // events are stored in localstorage to maintain the state locally even after a hard refresh
  useEffect(() => {
    localStorage.setItem("CALENDAR_EVENTS", JSON.stringify(events));
  }, [events]);

  /* Start - Header Actions */

  /* Handles date selection from the date picker input
     Updates the calendar view to show the selected month and year
   */
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const newMonth = selectedDate.getMonth();
    const newYear = selectedDate.getFullYear();
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  /* Handles clicking the left arrow to move to the previous month
     If current month is January (0), decrements the year and sets month to December (11)
   */

  const onLeftArrowClick = () => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  /* Handles clicking the right arrow to move to the next month
     If current month is December (11), increments the year and sets month to January (0)
   */

  const onRightArrowClick = () => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  /* Handles clicking the "Today" button
     Sets the calendar view to current month and year
     Scrolls to today's date in the calendar if it exists
   */

  const handleTodayClick = () => {
    setSelectedMonth(todaysDate.getMonth());
    setSelectedYear(todaysDate.getFullYear());
    const todayElement = document.querySelector(".today-date");
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  /* End - Header Actions */

  const handleCardClick = (index) => {
    setDeletePopupIndex(index);
  };

  const handleAddResource = () =>
    setResources([...resources, String.fromCharCode(65 + resources.length)]);

  const calculateTime = (x) => {
    const totalMinutes =
      (((x - RESOURCE_COLUMN_WIDTH) % COLUMN_WIDTH) / COLUMN_WIDTH) * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const calculateRowHeight = (rowIndex) => {
    const rowElement = document.querySelector(
      `tbody tr:nth-child(${rowIndex + 1})`
    );
    return rowElement ? rowElement.clientHeight : 0;
  };

  const onDeleteEvent = () => {
    const updatedEvents = events.map((event, index) => {
      if (index === deletePopupIndex) {
        return { ...event, isDeleted: true };
      }
      return event;
    });
    setEvents(updatedEvents);
    setDeletePopupIndex(null);
  };

  /* Start - Mouse events for creating new events */

  /**
   * Initiates the event creation process when user clicks on the timeline
   * - Prevents starting a new selection if already selecting or dragging
   * - Sets initial coordinates for the new event
   */
  const handleMouseDown = (e) => {
    if (isSelecting || draggedEventIndex !== null) return;
    setIsSelecting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setEndX(e.clientX - rect.left);
  };

  /**
   * Updates the event dimensions as user drags to create new event
   * - Tracks the end position of the event
   * - Determines which resource row the event belongs to
   */
  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    setEndX(e.clientX);
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top - HEADER_HEIGHT;
    const newRowNo = Math.floor(y / rowHeight);
    setRowNo(newRowNo);
  };

  /**
   * Finalizes the event creation when user releases mouse button
   * - Creates new event if there's a valid selection
   * - Adds event to calendar with calculated times and position
   * - Resets selection state
   */
  const handleMouseUp = () => {
    if (startX !== endX && draggedEventIndex === null) {
      const eventNo = events.length + 1;
      const newEvent = {
        startX,
        endX,
        rowNo,
        title: `Event ${eventNo}`,
        color: eventColors[(eventNo - 1) % eventColors.length],
        startTime: calculateTime(startX),
        endTime: calculateTime(endX),
        month: selectedMonth,
        year: selectedYear,
      };
      setEvents((events) => [...events, newEvent]);
    }
    setIsSelecting(false);
  };

  /* End - Mouse events */
  /* Start - Drag events for moving existing events */

  /**
   * Initiates dragging of an existing event
   * - Stores the event index being dragged
   * - Calculates and stores initial mouse-to-event offset
   * - Prevents new event creation while dragging
   */
  const handleEventDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedEventIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  /**
   * Updates event position as user drags
   * - Maintains event duration while moving
   * - Updates event times based on new position
   * - Prevents dragging beyond timeline boundaries
   * - Updates the resource row based on vertical position
   */
  const handleEventDragMove = (e) => {
    if (draggedEventIndex === null) return;

    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - HEADER_HEIGHT - dragOffset.y;
    const newRowNo = Math.floor(newY / rowHeight);

    setEvents(
      events.map((event, index) => {
        if (index === draggedEventIndex) {
          const width = event.endX - event.startX;
          const newStartX = Math.max(RESOURCE_COLUMN_WIDTH, newX);
          return {
            ...event,
            startX: newStartX,
            endX: newStartX + width,
            rowNo: newRowNo >= 0 ? newRowNo : 0,
            startTime: calculateTime(newStartX),
            endTime: calculateTime(newStartX + width),
          };
        }
        return event;
      })
    );
  };

  /**
   * Completes the event dragging operation
   * - Resets the dragging state
   */
  const handleEventDragEnd = () => {
    setDraggedEventIndex(null);
  };

  /* End - Drag events */

  const rowHeight = calculateRowHeight(rowNo);

  return (
    <div className="container">
      <Header
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onDateChange={onDateChange}
        onLeftArrowClick={onLeftArrowClick}
        onRightArrowClick={onRightArrowClick}
        handleTodayClick={handleTodayClick}
      />
      <div
        className="timeline"
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleEventDragMove(e);
        }}
        onMouseUp={() => {
          handleMouseUp();
          handleEventDragEnd();
        }}
      >
        <TimelineTable
          resources={resources}
          daysOfMonthArray={daysOfMonthArray}
          headerHeight={HEADER_HEIGHT}
          resourceColumnWidth={RESOURCE_COLUMN_WIDTH}
          columnWidth={COLUMN_WIDTH}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        <button className="add-resource-button" onClick={handleAddResource}>
          Add Resource
        </button>
        <AllEvents
          events={events}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleCardClick={handleCardClick}
          handleEventDragStart={handleEventDragStart}
          calculateRowHeight={calculateRowHeight}
          headerHeight={HEADER_HEIGHT}
        />
        {isSelecting && endX - startX > 2 && (
          <EventCard
            title="New Event"
            startX={startX}
            endX={endX}
            bg={eventColors[events.length]}
            startY={rowNo * calculateRowHeight(rowNo) + HEADER_HEIGHT}
            startTime={calculateTime(startX)}
            endTime={calculateTime(endX)}
          />
        )}
      </div>
      {deletePopupIndex !== null && (
        <Modal
          title="Do you want to delete this event?"
          onSecondaryCtaClick={() => setDeletePopupIndex(null)}
          secondaryCta="Cancel"
          ctaText="Delete"
          onCtaClick={onDeleteEvent}
        />
      )}
    </div>
  );
}
