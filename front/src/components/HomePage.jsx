
import React, { useEffect, useState } from 'react';
import video from './video/video.mp4';
import { Link, useNavigate } from 'react-router-dom'; // Import the Link component


const HomePage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetch('/api/homepage')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error:', error));
  }, []);

  const onSelectCompany = (event) => {
    const selectedCompany = event.target.value;
    // Assuming the values of the options are 'company1', 'company2', 'company3'
    if (selectedCompany === 'company2') {
      navigate('/homepage2'); // Use navigate function to navigate to '/homepage2'
    } else if (selectedCompany === 'company3') {
      navigate('/homepage3'); // Use navigate function to navigate to '/homepage3'
    }
  };

  return (
    <div className="home-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          Falca
        </Link>

        <h1>{message}</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <video className="video-bg" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-6">
            <div className="card bg-secondary justify-content-center mt-5">
              <div className="card-body text-center">
                <h1 className="mt-5 text-dark">Welcome to Falca</h1>
                <div className="options d-flex justify-content-center mt-5">
                  <Link to="/farmerlist" className="btn btn-outline-warning btn-lg mx-2">

                    Farmer
                  </Link>
                  {/* <button className="btn btn-primary btn-lg mx-2">Traders</button> */}
                  <Link to="/traderlist" className="btn btn-outline-warning btn-lg mx-2">
                    Trader
                  </Link>
                </div>


                <div className="form-group mt-4">
                  <label htmlFor="company" className="text-dark">
                    Select Company:
                  </label>
                  <select id="company" className="form-control" onChange={onSelectCompany}>
                    <option value="company1">Falca</option>
                    <option value="company2">Falca2</option>
                    <option value="company3">Company 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
