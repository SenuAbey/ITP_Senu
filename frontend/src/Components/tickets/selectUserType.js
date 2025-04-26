import React from 'react';
import { Link } from 'react-router-dom';
import './ticket.css';

function SelectUserType() {
  return (
    <div className="select-user-type">
      <h2>Select User Type</h2>
      <button>
        <Link to="/ticketAdmin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
      </button>
      <button>
        <Link to="/ticketCustomer" style={{ color: 'white', textDecoration: 'none' }}>Customer</Link>
      </button>
    </div>
  );
}

export default SelectUserType;