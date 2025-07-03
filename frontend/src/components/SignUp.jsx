import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css';

const SignUp = () => {
    const [employees, setEmployees] = useState([]);
    const [guests, setGuests] = useState([]);
    const navigate = useNavigate();

    const [signType, setSignType] = useState("Sign In");
    const [role, setRole] = useState("Guest");
    const [position, setPosition] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        dob: "",
        salary: 0,
    });

    useEffect(() => {
        if (signType === "Sign In") {
            console.log("API BASE:", process.env.REACT_APP_API_BASE);

            fetch(`${process.env.REACT_APP_API_BASE}/employees`)
                .then(response => response.json())
                .then(data => setEmployees(data))
                .catch(error => console.error('Error fetching employees:', error));

            fetch(`${process.env.REACT_APP_API_BASE}/guests`)
                .then(response => response.json())
                .then(data => setGuests(data))
                .catch(error => console.error('Error fetching guests:', error));
        }
    }, [signType]);

    const handleSignInType = () => setSignType("Sign In");
    const handleSignUpType = () => setSignType("Sign Up");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handlePositionChange = (e) => {
        const selectedPosition = e.target.value;
        setPosition(selectedPosition);
        const salaryMap = {
            Receptionist: 3000,
            Security: 1200,
            Manager: 10200,
            Housekeeping: 1700
        };
        setFormData({ ...formData, salary: salaryMap[selectedPosition] || 0 });
    };

    const createUser = async () => {
        const userData = {
            ...formData,
            role,
            position,
            age: role === "Guest" ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : undefined
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/create_user`
, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
            } else {
                alert(result.message || "Error creating user");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSignInButton = () => {
        const foundEmployee = employees.find(emp => emp.email === formData.email) || null;
        const foundGuest = guests.find(gst => gst.email === formData.email) || null;

        if (foundEmployee) {
            navigate('/employee', { state: { user: foundEmployee } });
        } else if (foundGuest) {
            navigate('/guest', { state: { user: foundGuest } });
        } else {
            alert('No user found with this email');
        }
    };

    if (signType === "Sign In") {
        return (
            <div className='container-whole' style={{margin: '10% auto'}}>
                <h2>{signType}</h2>
                <div className='choice-button-container'>
                    <button onClick={handleSignUpType} className='choice-button'>Sign Up</button>
                    <button onClick={handleSignInType} className='choice-button'>Sign In</button>
                </div>
                <div className='inputSign'>
                    <input
                        type="email"
                        className="inputSign"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='submit-container'>
                    <button onClick={handleSignInButton}>{signType}</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className='container-whole' style={{margin: '3% auto'}}>
                <h2>{signType}</h2>
                <div className='choice-button-container'>
                    <button onClick={handleSignUpType} className='choice-button'>Sign Up</button>
                    <button onClick={handleSignInType} className='choice-button'>Sign In</button>
                </div>
                <div className="inputsBoxHolder">
                    <input
                        type="text"
                        className="inputSign"
                        placeholder="Enter Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="email"
                        className="inputSign"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        className="inputSign"
                        placeholder="Enter Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        className="inputSign"
                        placeholder="Enter Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        className="inputSign"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                    />
                    <div className='role-container'>
                        <main>Role:</main>
                        <select name="role" id="selection-role" onChange={handleRoleChange} value={role}>
                            <option value="Employee">Employee</option>
                            <option value="Guest">Guest</option>
                        </select>
                    </div>
                    {role === "Employee" && (
                        <div className='position-container'>
                            <main>Position:</main>
                            <select id='selection-position' onChange={handlePositionChange} value={position}>
                                <option value="">Select Position</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Security">Security</option>
                                <option value="Manager">Manager</option>
                                <option value="Housekeeping">Housekeeping</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className='submit-container'>
                    <button onClick={createUser}>{signType}</button>
                </div>
            </div>
        );
    }
};

export default SignUp;
