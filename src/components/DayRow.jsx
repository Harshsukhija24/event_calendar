import React from "react";

export default function DayRow({
  daysOfMonthArray,
  selectedMonth,
  selectedYear,
  columnWidth,
}) {
  return (
    <>
      {daysOfMonthArray.map((c, index) => {
        const [day, weekday] = c.split(" ");
        const today = new Date();

        const isToday =
          today.getDate() === parseInt(day) &&
          today.getMonth() === selectedMonth &&
          today.getFullYear() === selectedYear;
        return (
          <td key={index} style={{ minWidth: columnWidth }}>
            <span className={isToday ? "today-date" : ""}>{c}</span>
          </td>
        );
      })}
    </>
  );
}
