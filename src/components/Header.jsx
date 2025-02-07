import React from "react";
import DatePicker from "./DatePicker";

export default function Header({
  selectedMonth,
  selectedYear,
  onDateChange,
  onLeftArrowClick,
  onRightArrowClick,
  handleTodayClick,
}) {
  const monthName = new Date(selectedYear, selectedMonth).toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  return (
    <div className="header">
      <div>
        <DatePicker
          onDateChange={onDateChange}
          monthName={monthName}
          selectedYear={selectedYear}
        />
      </div>
      <div className="today-title">
        <span className="arrow" onClick={onLeftArrowClick}>
          &lt;
        </span>
        <span onClick={handleTodayClick}>Today</span>
        <span className="arrow" onClick={onRightArrowClick}>
          &gt;
        </span>
      </div>
    </div>
  );
}
