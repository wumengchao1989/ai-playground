import React, { useState } from "react";
import { DatePicker, Button } from "antd";
function HotelBookingForm() {
  // State to store the selected start and end times
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Function to handle submission of the form
  const handleSubmit = () => {
    // Perform any necessary actions with the selected start and end times
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    // Additional logic...

    // Reset the form
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <div>
      <DatePicker
        placeholder="Select Start Time"
        showTime
        value={startTime}
        onChange={(value) => setStartTime(value)}
        style={{ marginBottom: 16 }}
      />
      <DatePicker
        placeholder="Select End Time"
        showTime
        value={endTime}
        onChange={(value) => setEndTime(value)}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

const Demo = () => {
  return (
    <div>
      <HotelBookingForm />
    </div>
  );
};
export default Demo;
