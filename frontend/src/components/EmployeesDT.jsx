import React, { useState, useEffect } from "react";

const EmployeesDT = (props) => {
    const [employees, setEmployees] = useState([]);
    const [guests, setGuests] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        fetch('http://127.0.0.1:5000/employees')
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error('Error fetching employees:', error));
    
        fetch('http://127.0.0.1:5000/guests')
            .then(response => response.json())
            .then(data => setGuests(data))
            .catch(error => console.error('Error fetching guests:', error));
    }, []);

    const deleteUser = async (userId) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/delete_user/${userId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          const data = await response.json();
          alert(data.message);
        } 
        else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    console.log(props.currentEmployeePos);


    const openUpdateModal = (user) => {
      setCurrentUser(user);
      setFormValues({ ...user }); // Populate form with user data
      setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
  };

  const handleUpdateSubmit = async () => {
      try {
          const response = await fetch(`http://127.0.0.1:5000/update_user/${currentUser.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formValues),
          });

          if (response.ok) {
              const data = await response.json();
              alert(data.message);
              setIsModalOpen(false);
          } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.message}`);
          }
      } catch (error) {
          console.error("Error updating user:", error);
      }
  };

    return (
        <div style={{ padding: "20px" }}>
          {props.index === 0 ? 
            (<h2>Employees Table</h2>)
            : props.index === 1 ? 
            (<h2>Guests Table</h2> )
            : props.index === 2 ?
            (<h2>Third card</h2>)
            : <h2>Nothing to show</h2>
          }
            {props.index === 0 ? (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Salary</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index} style={{ height: 50 }}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.position}</td>
                                <td>{employee.salary} EGP</td>
                                <td>{employee.address}</td>
                                <td>{employee.phone}</td>
                                {props.currentEmployeeID === employee.id ? "" : 
                                <td>
                                <div><button className="uoButton" onClick={() => openUpdateModal(employee)}>Update</button></div>
                                <div><button className="uoButton">Delete</button></div>
                              </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : props.index === 1 ? (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Address</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest, index) => (
                            <tr key={index} style={{ height: 120 }}>
                                <td>{guest.id}</td>
                                <td>{guest.name}</td>
                                <td>{guest.age}</td>
                                <td>{guest.address}</td>
                                <td>{guest.phone}</td>
                                {props.currentEmployeePos !== "Manager" && props.currentEmployeePos !== "Receptionist" ? "" : 
                                <td>
                                <div><button className="uoButton" onClick={() => openUpdateModal(guest)}>Update</button></div>
                                <div><button className="uoButton" onClick={() => deleteUser(guest.id)}>Delete</button></div>
                              </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : props.index === 2 ? (
                <p>This card is on update...</p>
            ) : (<p>hi</p>)}



{isModalOpen && (
    <div className="modal-overlay">
        <div className="modal-container">
            <div className="modal-header">
                <h3>Update User</h3>
                <button
                    className="modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                >
                    &times;
                </button>
            </div>
            <form>
                {Object.keys(formValues).map((key) => (
                    <div key={key}>
                        <label>{key}</label>
                        <input
                            name={key}
                            value={formValues[key]}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
                <button type="button" onClick={handleUpdateSubmit}>
                    Submit
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </button>
            </form>
        </div>
    </div>
)}
        </div>
    );
};

export default EmployeesDT;
