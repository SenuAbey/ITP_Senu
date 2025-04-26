import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import './UpdateVehicle.css';

function UpdateVehicle() {

     const [inputs, setInputs] = useState({
        vehicleID: '',
        vehicleModel: '',
        vehicleType: '',
        vehiclePriceHour: '',
        vehiclePriceDay: '',
        vehicleStatus: '',
        vehicleMileage: '',
        vehicleImage: null,  // Initialize vehicleImage to null
     });
     const history = useNavigate();
     const {id} = useParams();

     // Declare dropdown values here
    const vehicleTypes = ["Car", "Van", "Motor-Bicycle", "Hyper Bicycle","Lorry"];
    const vehicleStatuses = ["Available", "Not Available", "Under Maintenance"];

     useEffect(()=>{
        if (!id) {
            console.log("Vehicle ID is missing in the URL.");
            return;  // If id is not available, do not proceed further
        }

       // if (!id) return;
        const fetchHandler = async()=>{
            try{
                const res = await axios.get(`http://localhost:5000/Vehicles/${id}`);
                console.log(res.data);

                const vehicle = res.data.foundVehicle;

                if(vehicle) {
                    setInputs({
                        vehicleID: vehicle.vehicleID,
                        vehicleModel: vehicle.vehicleModel,
                        vehicleType: vehicle.vehicleType,
                        vehiclePriceHour: vehicle.vehiclePriceHour,
                        vehiclePriceDay: vehicle.vehiclePriceDay,
                        vehicleStatus: vehicle.vehicleStatus,
                        vehicleMileage: vehicle.vehicleMileage,
                        vehicleImage: vehicle.vehicleImage || null,
                    });
                } else{
                    console.log("Vehicle not found or invalid response format.");
                }
                
            }catch(err){
                console.log("Error fetching data: ", err);
            }
        };
        fetchHandler();
     },[id]);

    const handleFileChange = (e) => {

        setInputs((prevState) => ({
            ...prevState,
            vehicleImage: e.target.files.length > 0 ? e.target.files[0] : prevState.vehicleImage,
        }));
    };

    const sendRequest = async()=>{
        const formData = new FormData();

        // Append form fields to formData
        formData.append("vehicleID", String(inputs.vehicleID));
        formData.append("vehicleModel", String(inputs.vehicleModel));
        formData.append("vehicleType", String(inputs.vehicleType));
        formData.append("vehiclePriceHour", String(inputs.vehiclePriceHour));
        formData.append("vehiclePriceDay", String(inputs.vehiclePriceDay));
        formData.append("vehicleStatus", String(inputs.vehicleStatus));
        formData.append("vehicleMileage", String(inputs.vehicleMileage));

        // Append the image file to formData if available
        if (inputs.vehicleImage && typeof inputs.vehicleImage !== 'string') {
            formData.append("vehicleImage", inputs.vehicleImage);
        }

        try {
            await axios.put(`http://localhost:5000/Vehicles/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                }
            });
        } catch (err) {
            console.log("Error updating vehicle: ", err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log(inputs);
        sendRequest().then(()=>{
            alert("Vehicle details Updated Successfully!");
            history('/vehicleDetails');
        }).catch((err)=>{
            alert("There was an error updating vehicle details.");
        });

    };

    const handleChange =(e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setInputs((prevState) => ({
                ...prevState,
                [name]: files[0],  // Handle the file input
            }));
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        if (!inputs.vehicleID || !inputs.vehicleModel || !inputs.vehicleType || !inputs.vehicleStatus) {
            alert("Please fill all required fields.");
            return false;
        }

        if (isNaN(inputs.vehiclePriceHour) || inputs.vehiclePriceHour <= 0) {
            alert("Vehicle Price per Hour must be a positive number.");
            return false;
        }

        if (isNaN(inputs.vehiclePriceDay) || inputs.vehiclePriceDay <= 0) {
            alert("Vehicle Price per Day must be a positive number.");
            return false;
        }

        if (isNaN(inputs.vehicleMileage) || inputs.vehicleMileage <= 0) {
            alert("Vehicle Mileage must be a positive number.");
            return false;
        }

        return true;
    };

    if (!inputs.vehicleID) {
        return <h2>Loading vehicle details...</h2>;
    }

  return (
    <div>
      <h1>update user</h1>
      <form onSubmit={handleSubmit} className="update-vehicle-form">
        <label>Vehicle ID</label>
        <input type="text" name="vehicleID" onChange={handleChange} value={inputs.vehicleID} required readOnly></input>
        <br/>
        <label>Vehicle Model</label>
        <input type="text" name="vehicleModel" onChange={handleChange} value={inputs.vehicleModel} required></input>
        <br/>
        <label>Vehicle Type</label>
        <select name="vehicleType" onChange={handleChange} value={inputs.vehicleType} required>
            <option value="">Select Type</option>
            {vehicleTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
        </select>
        <br/>
        <label>Vehicle Price per Hour</label>
        <input type="number" name="vehiclePriceHour"  onChange={handleChange} value={inputs.vehiclePriceHour} required></input>
        <br/>
        <label>Vehicle Price per Day</label>
        <input type="number" name="vehiclePriceDay"  onChange={handleChange} value={inputs.vehiclePriceDay} required></input>
        <br/>
        <label>Vehicle Status</label>
        <select name="vehicleStatus" onChange={handleChange} value={inputs.vehicleStatus} required>
            <option value="">Select Status</option>
            {vehicleStatuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
            ))}
        </select>
        <br/>
        <label>Vehicle Mileage</label>
        <input type="number" name="vehicleMileage"  onChange={handleChange} value={inputs.vehicleMileage} required></input>
        <br/>
        <label>Vehicle Image</label>
        <input type="file" name="vehicleImage" onChange={handleFileChange} />
        {inputs.vehicleImage && inputs.vehicleImage !== null && (
            <div>
                <img
                    src={typeof inputs.vehicleImage === 'string'
                        ? `http://localhost:5000/${inputs.vehicleImage}` // URL if vehicleImage is a string
                        : URL.createObjectURL(inputs.vehicleImage)} // Display file if it's a new selected file
                    alt="Current Vehicle"
                    style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
            </div>
        )}


        <br />
        <button>Update</button>
      </form>
    </div>
  )
}

export default UpdateVehicle
