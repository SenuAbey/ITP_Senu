import React,{useState} from "react"
import axios from "axios"
import "./AddStaff.css"


export default function AddStaff(){

    //variable initialize
    const [staffID, setStaffID] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [NIC, setNIC] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [driversLicense, setDriversLicense] = useState(null);


    function validateForm() {
        if (!staffID || !username || !NIC || !firstName || !lastName || !dob || !gender || !contactNumber || !email || !yearsOfExperience || !driversLicense) {
            alert("Please fill all fields");
            return false;
        }

        //validate NIC
        const nicRegex = /^([0-9]{9}[VvXx]|[0-9]{12})$/;
        if (!nicRegex.test(NIC.trim())) {
            alert("Invalid NIC format. Use 9 digits followed by V/X or a 12-digit format.");
            return false;
        }
        //validate Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format.");
            return false;
        }
        //validate phone Number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactNumber)) {
            alert("Invalid contact number. Must be 10 digits.");
            return false;
        }
        //validate years of experience
        if (isNaN(yearsOfExperience) || yearsOfExperience < 0) {
            alert("Years of experience must be a positive number.");
            return false;
        }

        // License document validation
        if (!driversLicense) {
            alert("Please upload a driver's license document.");
            return false;
        }

        // Allowed file types: PDF, JPG, PNG
        const allowedExtensions = /(\.pdf|\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.test(driversLicense.name)) {
            alert("Invalid file type. Please upload a PDF, JPG, or PNG file.");
            return false;
        }

        // File size validation (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (driversLicense.size > maxSize) {
            alert("File size exceeds 2MB. Please upload a smaller file.");
            return false;
        }


        return true;
    }


    function sendData(e){
        e.preventDefault();
         // Basic validation to ensure no field is empty
         if (!validateForm()) return;
        

        const formData = new FormData();
        formData.append("staffID", staffID);
        formData.append("username", staffID);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("NIC", NIC);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("contactNumber", contactNumber);
        formData.append("email", email);
        formData.append("yearsOfExperience", yearsOfExperience);
        formData.append("driversLicense", driversLicense);

    axios
        .post("http://localhost:8070/staff/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
            alert("Staff Added");
            setStaffID("");
            setUsername("");
            setFirstName("");
            setlastName("");
            setNIC("");
            setDob("");
            setGender("");
            setContactNumber("");
            setEmail("");
            setYearsOfExperience("");
            setDriversLicense(null);
        })
        .catch((err) => {
            alert(err.response?.data?.message || "Error adding staff");
        });
    }



    return(
        <div>
            <div className = "container" >
            <form onSubmit ={sendData}>  
            <div className="form-group">
                        <label htmlFor="staffID">Staff ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="staffID"
                            placeholder="Enter Staff ID"
                            onChange={(e) => setStaffID(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="on"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter Last Name"
                            onChange={(e) => setlastName(e.target.value)}
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="NIC">NIC</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="NIC"  
                            name="NIC"
                            placeholder="Enter Your NIC"  
                            autoComplete="username"  // Enables autofill (alternative: use "off" to disable)
                            onChange={(e) => {
                                setNIC(e.target.value);
                            }}
                        />
                    </div>
                <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dob"
                            onChange={(e) => setDob(e.target.value)}
                            autoComplete="bday"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            className="form-control"
                            id="gender"
                            onChange={(e) => setGender(e.target.value)}
                            autoComplete="sex"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="contactNumber"
                            placeholder="Enter Contact Number"
                            onChange={(e) => setContactNumber(e.target.value)}
                            autoComplete="tel"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                            type="number"
                            className="form-control"
                            id="yearsOfExperience"
                            placeholder="Enter Years of Experience"
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="driversLicense">Driver's License Copy</label>
                        <input
                            type="file"
                            className="form-control"
                            id="driversLicense"
                            onChange={(e) => setDriversLicense(e.target.files[0])}
                            autoComplete="off"
                        />
                    </div>


                
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
        </div>
    )
}