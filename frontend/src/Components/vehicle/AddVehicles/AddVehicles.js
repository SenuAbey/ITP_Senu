import React ,{useState,useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddVehicles.css';


const vehiclePricing = {
    Car: { perHour: 2000, perDay: 20000 },
    Van: { perHour: 2500, perDay: 25000 },
    "Motor-Bicycle": { perHour: 1000, perDay: 10000 },
    "Hyper Bicycle": { perHour: 3500, perDay: 35000 },
    Lorry: { perHour: 3500, perDay: 35000 },
  };

  
function AddVehicles() {

    const history = useNavigate();
    const [inputs,setInputs] = useState({
        vehicleID: "",
        vehicleModel: "",
        vehicleType: "",
        vehiclePriceHour: "",
        vehiclePriceDay: "",
        vehicleStatus: "",
        vehicleMileage:"",
        vehicleImage: null
    });

    // Declare dropdown values here
    const vehicleTypes = ["Car", "Van", "Motor-Bicycle", "Hyper Bicycle","Lorry"];
    const vehicleStatuses = ["Available", "Not Available", "Under Maintenance"];

    useEffect(() => {
        // Fetch the latest vehicle ID from the database and auto-generate the next one
        const fetchLatestVehicleID = async () => {
            try {
                const response = await axios.get("http://localhost:5000/Vehicles");
                const vehicles = response.data.Vehicles;
                const lastVehicle = vehicles[vehicles.length - 1]; // Get the last added vehicle
                const lastID = lastVehicle ? lastVehicle.vehicleID : 0; // Default to 'vehicle0' if no vehicles
    
                // Generate the next vehicle ID by incrementing the number
                const nextID = !isNaN(lastID) && lastID >= 0 ? lastID + 1 : 1;
                setInputs((prevState) => ({
                    ...prevState,
                    vehicleID: nextID // Set the auto-generated vehicle ID
                }));
            } catch (error) {
                console.error("Error fetching latest vehicle ID:", error);
            }
        };
    
        fetchLatestVehicleID(); // Fetch latest vehicle ID on component mount
    }, []);
    

    const handleChange =(e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setInputs((prevState) => ({
                ...prevState,
                [name]: files[0],  // Handle file input
            }));
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            vehicleImage: e.target.files[0], // Store the selected image
        }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log(inputs);
        
        sendRequest().then(()=>{
            alert("Vehicle added Successfully!");
            history('/vehicleDetails');
        }).catch((err)=>{
            alert("There was an error adding the vehicle.");
        });
        
    };

    const sendRequest = async () => {
        const formData = new FormData();

        // Append form fields to formData
        formData.append("vehicleID", inputs.vehicleID);
        formData.append("vehicleModel", inputs.vehicleModel);
        formData.append("vehicleType", inputs.vehicleType);
        formData.append("vehiclePriceHour", inputs.vehiclePriceHour);
        formData.append("vehiclePriceDay", inputs.vehiclePriceDay);
        formData.append("vehicleStatus", inputs.vehicleStatus);
        formData.append("vehicleMileage", inputs.vehicleMileage);

        // Append the image file to the formData if available
        if (inputs.vehicleImage) {
            formData.append("vehicleImage", inputs.vehicleImage);
        }

        try {
            const res = await axios.post("http://localhost:5000/Vehicles", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                }
            });
            return res.data;
        } catch (err) {
            console.error("Error adding vehicle: ", err);
            throw err;
        }
    };
    

 
  return (
    
    <div>

      <h1>Add vehicles</h1>
      <form className="add-vehicle-form" onSubmit={handleSubmit}>
        <label>Vehicle ID</label>
        <input type="text" name="vehicleID" onChange={handleChange} value={inputs.vehicleID} required readOnly ></input>
        <br/>
        <label>Vehicle Model</label>
        <input type="text" name="vehicleModel" onChange={handleChange} value={inputs.vehicleModel} required></input>
        <br/>
        <label>Vehicle Type</label>
        
        <select
            name="vehicleType"
            value={inputs.vehicleType}
            onChange={(e) => {
                const selectedType = e.target.value;
                const pricing = vehiclePricing[selectedType];

                setInputs((prevState) => ({
                ...prevState,
                vehicleType: selectedType,
                vehiclePriceHour: pricing ? pricing.perHour : "",
                vehiclePriceDay: pricing ? pricing.perDay : ""
                }));
            }}
            required>
            <option value="">Select Type</option>
            {vehicleTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
        </select>
        
        <br />
        <label>Vehicle Price per Hour</label>
        <input type="number" name="vehiclePriceHour"  onChange={handleChange} value={inputs.vehiclePriceHour} required readOnly></input>
        <br/>
        <label>Vehicle Price per Day</label>
        <input type="number" name="vehiclePriceDay"  onChange={handleChange} value={inputs.vehiclePriceDay} required readOnly></input>
        <br/>
        <label>Vehicle Status</label>
        <select name="vehicleStatus" onChange={handleChange} value={inputs.vehicleStatus} required>
            <option value="">Select Status</option>
            {vehicleStatuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
            ))}
        </select>
        <label>Vehicle Mileage</label>
        <input type="number" name="vehicleMileage"  onChange={handleChange} value={inputs.vehicleMileage} required></input>
        <br/>
        <label>Vehicle Image</label>
        <input type="file" name="vehicleImage" onChange={handleFileChange} />
        <br />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default AddVehicles
