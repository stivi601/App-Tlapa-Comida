# Admin Reports Implementation

## Overview
We have enhanced the Admin Dashboard to include a comprehensive reporting system, allowing analysis of sales, orders, and performance by restaurants and riders.

## Features Added

### 1. New Backend Endpoint
- **GET /api/admin/reports**
- **Query Parameters:**
    - `startDate`: Start of the reporting period (YYYY-MM-DD).
    - `endDate`: End of the reporting period (YYYY-MM-DD).
    - `restaurantId`: (Optional) Filter orders by a specific restaurant ID.
    - `riderId`: (Optional) Filter orders by a specific delivery rider ID.
- **Response Data:**
    - `summary`: Total sales and total order count for the selected range and filters.
    - `chartData`: Sales data dynamically grouped by Hour (for 1-2 day ranges) or Day (for longer ranges).
    - `restaurantRanking`: List of restaurants sorted by total sales.
    - `riderRanking`: List of delivery riders sorted by number of completed deliveries.

### 2. Frontend Dashboard Upgrade
- **Advanced Report Controls:**
    - **Date Range:** Select a custom "From" and "To" date.
    - **Filters:** Dropdowns to filter statistics by a specific **Restaurant** or **Delivery Rider**.
- **Dynamic Visualization:**
    - **Summary Cards:** Reflects the specific filtered data (e.g., Sales for Restaurant X in December).
    - **Sales Chart:** Automatically adjusts granularity (Hour/Day) based on the selected date range.
    - **Rankings:** Tables update to show relevant performance data for the selected criteria.

## Usage
1.  Navigate to the Admin Dashboard.
2.  Use the "Periodo" dropdown to select "Day", "Month", or "Year".
3.  Select a date using the date picker.
4.  Click "Generar Reporte".
5.  View the updated metrics and tables below.

## Persistence
All report data is calculated in real-time from the PostgreSQL/SQLite database, ensuring accuracy.
