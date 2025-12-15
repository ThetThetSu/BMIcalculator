import React from "react";

// function Category() {
//   return (
//     <div>
//       <p>
//         <span
//           style={{ width: "50px", height: "50px", backgroundColor: "blue" }}
//         >
//           blue
//         </span>
//         Underweight
//       </p>
//     </div>
//   );
// }
function Category() {
  const bmiCategories = [
    { label: "Underweight", color: "blue", range: "< 18.5" }, // blue
    { label: "Normal weight", color: "green", range: "18.5 – 24.9" }, // green
    { label: "Overweight", color: "yellow", range: "25.0 – 29.9" }, // yellow
    { label: "Obese", color: "red", range: "> 30" }, // red
  ];

  const cardStyle = {
    background: "#07152cff", // dark blue/gray
    padding: "10px 20px",
    borderRadius: "8px",
    width: "320px",
    color: "white",
    fontFamily: "sans-serif",
    // fontWeight: "bold",

    // margin: "0px auto",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5px",
  };

  const dotStyle = (color) => ({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: color,
    marginRight: "5px",
  });

  return (
    <div style={cardStyle}>
      {bmiCategories.map((item, index) => (
        <div key={index} style={rowStyle}>
          {/* Left side: dot + label */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={dotStyle(item.color)}></div>
            <span style={{ fontSize: "12px", marginRight: "20px" }}>
              {item.label}
            </span>
          </div>

          {/* Right side: Range text with color */}
          <span style={{ color: item.color, fontWeight: "bold" }}>
            {item.range}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Category;
