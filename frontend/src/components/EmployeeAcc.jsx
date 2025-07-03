import { useLocation } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import '../css/employeeAcc.css';

import EmployeesTable from './EmployeesDT';
import { isDisabled } from '@testing-library/user-event/dist/cjs/utils/index.js';

const EmployeeAcc = () => {

    const location = useLocation();
    const currentEmployee = location.state?.user;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(<EmployeesTable x={2} />);

    const openModal = (index) => {
        setModalContent(<EmployeesTable index={index} currentEmployeeID={currentEmployee.id} currentEmployeePos={currentEmployee.position} />);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent("");
    };

    return (
        <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>Hotel Management</h2>
          <p>2024 | Settings</p>
        </div>
        <nav>
          <ul>
            <li><i className="icon-folder"></i> Employee Info</li>
            <li><i className="icon-report"></i> Reports</li>
            <li><i className="icon-payroll"></i> Payroll</li>
            <li><i className="icon-invoice"></i> Invoices</li>
            <li><i className="icon-documents"></i> Documents</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="user-info">
          <div className='circle'><span>{currentEmployee.name[0]}</span></div>
          <h1>Hi, {currentEmployee.name}</h1>
          <p>{currentEmployee.position}</p>
        </header>

        {/* Cards Section */}
        <section className="cards">
          <div className="card blue">
            <i className="icon-folder"></i>
            <h3>Employee Files</h3>
            <p>Employee Section to display all your employee files.</p>
            <button onClick={() => openModal(0)} disabled={currentEmployee.position !== ("Manager") && ("Receptionist") }>View →</button>
          </div>
          <div className="card green">
            <i className="icon-report"></i>
            <h3>Guests Files</h3>
            <p>The Guests Section to display all guests in database.</p>
            <button onClick={() => openModal(1)}>View →</button>
          </div>
          <div className="card red">
            <i className="icon-payroll"></i>
            <h3>Payroll</h3>
            <p>Enter and manage payroll information efficiently.</p>
            <button onClick={() => openModal(2)}>View →</button>
          </div>
        </section>
      </main>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div>{modalContent}</div>
          </div>
        </div>
      )}
    </div>
    );
};

export default EmployeeAcc;
