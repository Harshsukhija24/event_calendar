import React from "react";
import DayRow from "./DayRow";

export default function TimelineTable({
  resources,
  daysOfMonthArray,
  headerHeight,
  resourceColumnWidth,
  columnWidth,
  selectedMonth,
  selectedYear,
}) {
  return (
    <table>
      <thead>
        <tr style={{ height: headerHeight }}>
          <td
            style={{
              minWidth: resourceColumnWidth,
            }}
          />
          <DayRow
            daysOfMonthArray={daysOfMonthArray}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            columnWidth={columnWidth}
          />
        </tr>
      </thead>
      <tbody>
        {resources.map((r) => (
          <tr key={r}>
            <td
              style={{
                minWidth: resourceColumnWidth,
              }}
            >
              Resource {r}
            </td>
            {daysOfMonthArray.map((c, index) => (
              <td
                key={index}
                style={{
                  minWidth: columnWidth,
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
