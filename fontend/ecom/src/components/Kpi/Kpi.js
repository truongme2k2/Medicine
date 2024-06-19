import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Kpi.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Kpi = ({ kpi, sum_total_price, matrix, text, month, quarter, year }) => {
  const [dmatrix, setDmatrix] = useState([]);
  const columnHeaders = [
    "Biện pháp",
    "Chi phí (1-5)",
    "Hiệu quả dự kiến (1-5)",
    "Khả năng thực hiện (1-5)",
    "Sự hài lòng của KH (1-5)",
    "Thời gian triển khai (1-5)",
    "Tác động lâu dài (1-5)",
    "Tổng điểm (30)",
    "Giải thích",
  ];
  

  useEffect(() => {
    if (matrix && typeof matrix === 'object') {
      const transformedMatrix = Array.from({ length: matrix[columnHeaders[0]].length }, (_, rowIndex) => 
        columnHeaders.map(header => matrix[header][rowIndex])
      );
      setDmatrix(transformedMatrix);
    }
  }, [matrix]);


  let backgroundColor = (kpi < 50) ? ["#FF5733", "#FFE5D0"] : ["#1250DC", "#C1D0F6"];
  let textColor = (kpi < 50) ? "#FF5733" : "#1250DC";

  const data = {
    labels: ["KPI","Others"],
    datasets: [
      {
        data: [kpi, 100 - kpi],
        backgroundColor: backgroundColor,
      },
    ],
  };

  let title = 'Báo cáo hiệu suất bán hàng';
  if (month && quarter && year) {
    title += ` Tháng ${month} Năm ${year}`;
  } else if (quarter && year) {
    title += ` Quý ${quarter} Năm ${year}`;
  } else if(month && year){
    title += ` Tháng ${month} Năm ${year}`;
  }else if (year) {
    title += ` Năm ${year}`;
  }

  return (
    <div>
      <div className="container mt-3">
        <h3>{title}</h3>
        <div className="row">
          <div className="chart-ctn col">
            <Pie data={data} className="chart" />
          </div>
          <div className="col">
            <div className="p-3 mb-3 rounded-1" style={{backgroundColor:"var(--color-white)"}}>
              <h5>KPI</h5>
              <p className="m-0" style={{color: textColor,fontWeight:"600"}}>{kpi}%</p>
            </div>
            <div className="p-3 mb-3 rounded-1" style={{backgroundColor:"var(--color-white)"}}>
              <h5>Tổng doanh thu</h5>
              <p style={{color:"var(--color-blue)",fontWeight:"600"}} className="m-0">{sum_total_price.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="p-3 mb-3 rounded-1" style={{backgroundColor:"var(--color-white)"}}>
              <h5>Nhận xét</h5>
              <p className="m-0">{text}</p>
            </div>
          </div>
        </div>
      </div>
      
  
      <div>
        <h5 className="pt-3 pb-2">Ma trận hỗ trợ quyết định</h5>
        <table className="table table-bordered matrix-table">
          <thead class="table-primary">
            <tr>
              {columnHeaders.map((header, index) => (
                <th className="text-center " key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dmatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className="text-center" key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pb-3"></div>
      </div>
    </div>
  );
};

export default Kpi;
