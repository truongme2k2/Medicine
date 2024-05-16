import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateProduct from './UpdateProduct'; // Import UpdateProduct component

function ChoosenProduct() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState(null); // State để lưu med_id được chọn

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('Access token not found in local storage');
          return;
        }

        let url = 'http://127.0.0.1:8000/api/getAllMedicine/';

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Xử lý sự kiện khi chọn một sản phẩm
  const handleSelectMedicine = (event) => {
    const selectedMedId = event.target.value;
    setSelectedMedId(selectedMedId);
  };

  return (
    <div className="container">
      <h2>Update Product</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Medicine</label>
        <select className="form-select" id="name" name="name" onChange={handleSelectMedicine}>
          <option value="">Select Medicine</option>
          {medicines.map(medicine => (
            <option key={medicine.med_id} value={medicine.med_id}>{medicine.name}</option> // Sử dụng med_id thay vì name
          ))}
        </select>
      </div>
      {/* Hiển thị UpdateProduct nếu có selectedMedId */}
      {selectedMedId && <UpdateProduct medId={selectedMedId} />}
    </div>
  );
}

export default ChoosenProduct;
