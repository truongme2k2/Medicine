import React from 'react';

function Report({ data, num_of_orders, sum_total_price, sum_productive, month, quarter, year }) {
  // Xác định tiêu đề của báo cáo
  let title = 'Báo cáo doanh số bán hàng';
  if (month && quarter && year) {
    title += ` tháng ${month} năm ${year}`;
  } else if (quarter && year) {
    title += ` quý ${quarter} năm ${year}`;
  } else if (year) {
    title += ` năm ${year}`;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>Tổng số lượng đơn hàng: {num_of_orders}</p>
      <p>Tổng doanh thu: {sum_total_price}đ</p>
      <p>Tổng lợi nhuận: {sum_productive}đ</p>
      <table className="table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng bán</th>
            <th>Tổng doanh thu</th>
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.saled}</td>
              <td>{item.total_price}đ</td>
              <td>{item.productive}đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Report;
