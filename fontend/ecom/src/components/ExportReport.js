import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Report from './Report';

function ExportReport() {
  const [month, setMonth] = useState('');
  const [quarter, setQuarter] = useState('');
  const [year, setYear] = useState('');
  const [report, setReport] = useState(null);

  const months = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' },
  ];

  const quarters = [
    { value: '1', label: 'Q1' },
    { value: '2', label: 'Q2' },
    { value: '3', label: 'Q3' },
    { value: '4', label: 'Q4' },
  ];

  const years = ['2021', '2022', '2023','2024'];

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleQuarterChange = (e) => {
    setQuarter(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleViewReport = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/viewReport/', {
        month: month,
        quarter: quarter,
        year: year
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // Set report using setReport function
      setReport(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleExportReport = () => {
    if (!report) {
      console.error('No report data to export');
      return;
    }

    const { data, num_of_orders, sum_total_price, sum_productive } = report;

    // Tạo một workbook mới
    const workbook = XLSX.utils.book_new();

    // Tạo một worksheet mới
    const worksheet = XLSX.utils.json_to_sheet(data,{ origin: 'A6' });

    // Thêm tiêu đề và thông số vào worksheet
    const title = `Báo cáo doanh số bán hàng ${month ? `tháng ${month}` : ''} ${quarter ? `quý ${quarter}` : ''} năm ${year}`;
    XLSX.utils.sheet_add_aoa(worksheet, [
      [title],
      ['Tổng số lượng đơn hàng:', num_of_orders],
      ['Tổng doanh thu:', sum_total_price],
      ['Tổng lợi nhuận:', sum_productive],
      [],
    ], { origin: 'A1' }); // Đặt origin ở ô A1

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo');

    // Tạo tên file dựa trên tháng, quý và năm
    const filename = `BaoCao_${month || 'Q' + quarter || ''}_${year}.xlsx`;

    // Xuất workbook ra file Excel
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div>
      <div className="row">
        <h1>Báo cáo doanh số bán hàng</h1>
        <div className="col">
          <select
            className="form-select"
            value={month}
            onChange={handleMonthChange}
          >
            <option value="">Chọn tháng</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            value={quarter}
            onChange={handleQuarterChange}
          >
            <option value="">Chọn quý</option>
            {quarters.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            value={year}
            onChange={handleYearChange}
          >
            <option value="">Chọn năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

      </div>
      <p></p>
      <div className="col">
        <button className="btn btn-success" onClick={handleViewReport}>
          Xem báo cáo
        </button>
        <a>           </a>
        <button className="btn btn-success" onClick={handleExportReport}>
          Xuất file báo cáo
        </button>
      </div>
      {report && (
        <Report
          data={report.data}
          num_of_orders={report.num_of_orders}
          sum_total_price={report.sum_total_price}
          sum_productive={report.sum_productive}
          month={month}
          quarter={quarter}
          year={year}
        />
      )}
    </div>
  );
}

export default ExportReport;
