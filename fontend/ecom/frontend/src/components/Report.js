import React from 'react';

function Report({ data, num_of_orders, sum_total_price, sum_productive, month, quarter, year }) {
  // Xác định tiêu đề của báo cáo
  let title = 'Báo cáo doanh số bán hàng';
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
      <h3 className='mt-3'>{title}</h3>
      <p style={{color:"var(--color-blue)",fontWeight:"600"}}>Tổng số lượng đơn hàng: {num_of_orders}</p>
      <p style={{color:"var(--color-blue)",fontWeight:"600"}}>Tổng doanh thu: {sum_total_price.toLocaleString('vi-VN')}đ</p>
      <p style={{color:"var(--color-blue)",fontWeight:"600"}}>Tổng lợi nhuận: {sum_productive.toLocaleString('vi-VN')}đ</p>
      <table className="table">
        <thead>
          <tr>
            <th style={{paddingLeft: "20px"}}>Tên sản phẩm</th>
            <th className='text-center'>Số lượng bán</th>
            <th className='text-center'>Tổng doanh thu</th>
            <th className='text-center'>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{width:"500px",paddingLeft: "20px"}}>{item.name}</td>
              <td className='text-center'>{item.saled}</td>
              <td className='text-center'>{item.total_price.toLocaleString('vi-VN')}đ</td>
              <td className='text-center' style={{color:"var(--color-blue)",fontWeight:"600"}}>{item.productive.toLocaleString('vi-VN')}đ</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pb-2'></div>
    </div>
  );
}

export default Report;
