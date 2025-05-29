import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleListing.css';

// Remove the imports at the top of the file

function VehicleListing() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Sample vehicle data - in a real app, this would come from an API
  const vehicles = [
    {
      id: 1,
      name: "2020 Honda Pilot EX-L Sport Utility 4D",
      price: "17,500",
      mileage: "45,658",
      image: "./cars/pilot2020.jpg",
      shipping: "Free Shipping",
      make: "Honda",
      model: "Pilot",
      year: 2020
    },
    {
      id: 2,
      name: "2023 Toyota Camry SE",
      price: "22,990",
      mileage: "89,789",
      image: "./cars/camry.jpeg",
      shipping: "Free Shipping",
      make: "Toyota",
      model: "Camry",
      year: 2023
    },
    {
      id: 3,
      name: "2022 Honda Civic",
      price: "21,990",
      mileage: "15,984",
      image: "./cars/civic2022.jpeg",
      shipping: "Free Shipping",
      make: "Honda",
      model: "Civic",
      year: 2022
    },
    {
      id: 4,
      name: "2021 Honda Pilot",
      price: "28,990",
      mileage: "53,789",
      image: "./cars/pilot2021.jpeg",
      shipping: "Free Shipping",
      make: "Honda",
      model: "Pilot",
      year: 2021
    },
    {
      id: 5,
      name: "2020 Honda Accord EX Sedan 4D",
      price: "14,200",
      mileage: "42,524",
      image: "./cars/accord2020.jpg",
      shipping: "Free Shipping",
      make: "Honda",
      model: "Accord",
      year: 2020
    },
    {
      id: 6,
      name: "2015 Honda Accord EX Sedan 4D",
      price: "9,700",
      mileage: "83,838",
      image: "./cars/accord2015.jpg",
      shipping: "Free Shipping",
      make: "Honda",
      model: "Accord",
      year: 2015
    }
  ];

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(searchTerm) ||
      vehicle.model.toLowerCase().includes(searchTerm) ||
      vehicle.year.toString().includes(searchTerm)
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="vehicle-listing">
      <div className="listing-header">
        <div className="breadcrumbs">
          Home > Inventory > Sedans
        </div>
        
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search cars..." 
            className="search-input" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="listing-container">
        <aside className="filters-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min" />
              <input type="number" placeholder="Max" />
            </div>
          </div>

          <div className="filter-group">
            <h4>Year</h4>
            <select>
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Make</h4>
            <select>
              <option value="">All Makes</option>
              <option value="honda">Honda</option>
              <option value="toyota">Toyota</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Damage Type</h4>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" value="front" /> Front End
              </label>
              <label>
                <input type="checkbox" value="rear" /> Rear End
              </label>
              <label>
                <input type="checkbox" value="minor" /> Minor
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Title Status</h4>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" value="salvage" /> Salvage
              </label>
              <label>
                <input type="checkbox" value="rebuilt" /> Rebuilt
              </label>
              <label>
                <input type="checkbox" value="clean" /> Clean
              </label>
            </div>
          </div>

          <button className="apply-filters">Apply Filters</button>
        </aside>

        <main className="listing-main">
          <div className="listing-controls">
            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''} 
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''} 
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
            
            <div className="sort-control">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest Listings</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Mileage: Low to High</option>
              </select>
            </div>
          </div>

          <div className={`vehicle-grid ${viewMode}`}>
            {filteredVehicles.map(vehicle => (
              <div className="vehicle-card" key={vehicle.id} onClick={() => navigate(`/inventory/${vehicle.id}`)}>
                <div className="car-image">
                  // Update the image rendering part
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    onError={(e) => {
                      console.error('Image failed to load:', vehicle.image);
                      e.target.src = './cars/placeholder.jpg'; // Add a placeholder image
                      e.target.onerror = null;
                    }}
                  />
                  <div className="price-badge">${vehicle.price.toLocaleString()}</div>
                  <button className="favorite-btn" onClick={(e) => e.stopPropagation()}>♡</button>
                </div>
                <div className="car-details">
                  <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <div className="car-meta">
                    <span>{vehicle.mileage.toLocaleString()} miles</span>
                    <span className="separator">•</span>
                    <span>{vehicle.title} Title</span>
                  </div>
                  <div className="delivery-info">
                    <span>Free shipping</span>
                    <span className="separator">•</span>
                    <span>Get it Monday</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default VehicleListing;