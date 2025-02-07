import React from "react";

export default function DatePicker({ onDateChange, monthName, selectedYear }) {
  const dateInputRef = React.useRef(null);

  return (
    <span
      className="month-year"
      onClick={() => {
        if (dateInputRef.current) {
          const inputElement = dateInputRef.current;
          inputElement.showPicker && inputElement.showPicker();
        }
      }}
    >
      <input
        ref={dateInputRef}
        type="date"
        className="date-input"
        onChange={onDateChange}
      />
      {monthName} {selectedYear}
    </span>
  );
}
