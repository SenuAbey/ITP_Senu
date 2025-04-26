import React, { useEffect, useState ,useRef} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import VehicleCard from '../Vehicles/Vehicles';
import './VehicleDetails.css';
import {useReactToPrint} from 'react-to-print';

const URL = "http://localhost:5000/Vehicles"

const fetchHandler = async () => {
  try{
    const response = await axios.get(URL);
    console.log('API Response:', response.data);
    return response.data.Vehicles;
  }catch(err){
    console.error('Error fetching data:', err);  // Handle any errors (e.g., network errors)
    return [];
  }
}

function VehicleDetails() {

  const ComponentsRef = useRef(null);


  const [vehicles, setVehicles] = useState([]);
  useEffect(()=>{
    fetchHandler().then((data) => {
      console.log('Fetched vehicles:', data);
      setVehicles(data);
    });
  },[]);

  //Download report
  
  const handlePrint = useReactToPrint({

    contentRef: ComponentsRef,
    documentTitle:'Vehicles Report' , 
    onAfterPrint:()=>{
      alert('Vehilce Report Successfully Downloaded.');
      console.log('Print job is done');
    },
  });

  const [searchQuery,setSearchQuery] = useState("");
  const [noResults,setNoResults] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); 
  const [sortField, setSortField] = useState("");

  const handleSearch = ()=> {
    if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
      setVehicles([]); // clear the list
      setNoResults(true); // show 'No Vehicles Found'
      alert("Please enter a valid keyword to search. Numbers are not allowed.");
      return;
    }

    fetchHandler().then((data)=>{
      const filteredVehicles = data.filter((vehicle) =>
        Object.values(vehicle).some((field)=>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ))
        setVehicles(filteredVehicles);
        setNoResults(filteredVehicles.length === 0);
    });
  }

  const handleSort = () => {
    if (!sortOrder || !sortField) {
      alert("Please select both sort field and order.");
      return;
    }
  
    const sortedVehicles = [...vehicles].sort((a, b) => {
      const priceA = parseFloat(a[sortField]);
      const priceB = parseFloat(b[sortField]);
  
      if (sortOrder === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  
    setVehicles(sortedVehicles);
  };
  

  return (
    <div>
      <h1>Vehicle Details Display Page</h1>
      <br/>
      <Link to="/addVehicle" id="add-vehicle-link">
                Add Vehicle
      </Link>      
      <br/><br/>
      <button id="download-report-btn" onClick ={handlePrint}>Download Report</button>
      <br/><br/><br/>
      <input id="vehicle-search"
        onChange={(e)=>setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search Vehicles Details">
      </input>

      <button id="search-btn" onClick ={handleSearch}>Search</button>

      <br/><br/>
      <div className="sort-controls">
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}>
        <option value="">-- Select Price Field --</option>
        <option value="vehiclePriceHour">Price per Hour</option>
        <option value="vehiclePriceDay">Price per Day</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}>
        <option value="">-- Select Sort Order --</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

      <button onClick={handleSort}>Sort</button>
      </div>

      {noResults ? (
          <div>
            <p>No Vehicles Found</p>
          </div>
      ):(

      <div className="vehicle-details-container" ref ={ComponentsRef}>
        {Array.isArray(vehicles) && vehicles.length > 0 ? (
          vehicles.map((vehicle, i) => (
            <div key={i}>
              <VehicleCard vehicle={vehicle} />
              
            </div>
          ))
        ) : (
          <p>No vehicles found or invalid data.</p>
        )}
      </div>
      )}

      

    </div>
  );
}

export default VehicleDetails;
