import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

function UpdateProduct({ medId }) {
    const [medicineDetail, setMedicineDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        description: '',
        quantity: 0,
    });
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [addedQuantity, setAddedQuantity] = useState(0);

    useEffect(() => {
        const fetchMedicineDetail = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                const url = `http://127.0.0.1:8000/api/getDetailMedicine/${medId}/`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setMedicineDetail(response.data);
                setFormData({
                    description: response.data.description,
                    quantity: response.data.quantity,
                });
                setCurrentQuantity(response.data.quantity);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching medicine detail:', error);
                setLoading(false);
            }
        };

        if (medId) {
            fetchMedicineDetail();
        }
    }, [medId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setAddedQuantity(parseInt(value));
    };

    const handleSave = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                console.error('Access token not found in local storage');
                return;
            }

            const url = `http://127.0.0.1:8000/api/updateMedicine/${medId}/`;

            const updatedQuantity = parseInt(currentQuantity) + parseInt(addedQuantity);

            const response = await axios.post(url, {
                ...medicineDetail,
                quantity: updatedQuantity,
                description: formData.description,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log('Medicine updated:', response.data);
            setCurrentQuantity(updatedQuantity);
        } catch (error) {
            console.error('Error updating medicine:', error);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!medicineDetail) {
        return <div className="text-center">Medicine not found</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <textarea className="form-control" value={formData.description} name="description" onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Current Quantity:</label>
                        <input type="text" className="form-control" value={currentQuantity} readOnly />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Quantity to Add:</label>
                        <input type="number" className="form-control" name="quantity" onChange={handleInputChange} />
                    </div>
                    <Button className="bg-primary" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
