import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    category: '', // Sửa lại thành category_id để lưu ID của category
    img: '',
    import_price: '',
    buy_price: '',
    type_of_user: '',
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      try {
        const categoryResponse = await axios.get('http://127.0.0.1:8000/api/getAllCategories/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const typeResponse = await axios.get('http://127.0.0.1:8000/api/getAllType/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setCategories(categoryResponse.data);
        setTypes(typeResponse.data);
      } catch (error) {
        console.error('Error fetching categories and types:', error);
      }
    };

    fetchData();
  }, []); // Chỉ chạy một lần sau khi component được render

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, img: file });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }
      let formDataToSend = { ...formData }; // Tạo một bản sao của formData để không ảnh hưởng đến dữ liệu gốc

      // Lấy đường dẫn tệp ảnh từ thuộc tính name của formData.img
      formDataToSend.img = "img/"+ formDataToSend.img.name;

      const response = await axios.post('http://127.0.0.1:8000/api/createMedicine/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      // Handle success, e.g., display success message
    } catch (error) {
      console.error('Error creating medicine:', error);
      // Handle error, e.g., display error message
    }
  };

  return (
    <div className="container">
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select className="form-select" id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="type_of_user" className="form-label">Type</label>
          <select className="form-select" id="type_of_user" name="type_of_user" value={formData.type_of_user} onChange={handleChange}>
            <option value="">Select Type</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="img" className="form-label">Image</label>
          <input type="file" className="form-control" id="img" name="img" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="import_price" className="form-label">Import Price</label>
          <input type="number" className="form-control" id="import_price" name="import_price" value={formData.import_price} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="buy_price" className="form-label">Buy Price</label>
          <input type="number" className="form-control" id="buy_price" name="buy_price" value={formData.buy_price} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </div>
  );
}

export default NewProduct;
