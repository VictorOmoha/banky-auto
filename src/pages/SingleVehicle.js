import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleVehicle.css';

function SingleVehicle() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveForm, setTestDriveForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    comments: ''
  });

  // Vehicle data mapping
  const vehicleData = {
    camry2023: {
      title: "2023 Toyota Camry SE",
      price: 22990,
      image: "/cars/camry.jpeg",
      mileage: "624 miles",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      trim: "SE",
      condition: "Salvage",
      damageHistory: "Repaired side impact damage",
      exteriorColor: "Red",
      interiorColor: "Black",
      transmission: "Automatic",
      drivetrain: "FWD",
      fuelType: "Gasoline",
      description: "Well-maintained Toyota Camry SE with low mileage."
    },
    civic2022: {
      title: "2022 Honda Civic",
      price: 21990,
      image: "/cars/civic2022.jpeg",
      mileage: "15k miles",
      make: "Honda",
      model: "Civic",
      year: 2022,
      trim: "EX",
      condition: "Used",
      exteriorColor: "Gray",
      interiorColor: "Black",
      transmission: "Automatic",
      drivetrain: "FWD",
      fuelType: "Gasoline",
      description: "Sporty and efficient Honda Civic in excellent condition."
    },
    pilot2021: {
      title: "2021 Honda Pilot",
      price: 28990,
      image: "/cars/pilot2021.jpeg",
      mileage: "32k miles",
      make: "Honda",
      model: "Pilot",
      year: 2021,
      trim: "EX-L",
      condition: "Used",
      exteriorColor: "Black",
      interiorColor: "Gray",
      transmission: "Automatic",
      drivetrain: "AWD",
      fuelType: "Gasoline",
      description: "Spacious and versatile Honda Pilot perfect for families."
    },
    pilot2020: {
      title: "2020 Honda Pilot EX-L Sport Utility 4D",
      price: 17500,
      image: "/cars/pilot2020.jpg",
      additionalImages: [
        "/cars/pilot2020a.jpg",
        "/cars/pilot2020b.jpg",
        "/cars/pilot2020c.jpg",
        "/cars/pilot2020d.jpg",
        "/cars/pilot2020e.jpg",
        "/cars/pilot2020f.jpg",
        "/cars/pilot2020g.jpg",
        "/cars/pilot2020h.jpg",
        "/cars/pilot2020i.jpg",
        "/cars/pilot2020j.jpg",
        "/cars/pilot2020k.jpg",
        "/cars/pilot2020l.jpg",
        "/cars/pilot2020m.jpg",
        "/cars/pilot2020n.jpg"
      ],
      mileage: "65,458 miles",
      make: "Honda",
      model: "Pilot",
      year: 2020,
      trim: "EX-L Sport",
      condition: "Used",
      exteriorColor: "Silver",
      interiorColor: "Grey",
      transmission: "Automatic",
      drivetrain: "4D",
      fuelType: "Gasoline",
      description: "Well-maintained Honda Pilot with backup camera and carplay. This vehicle is paid off."
    },
    accord2020: {
      title: "2020 Honda Accord EX Sedan 4D",
      price: 14200,
      image: "/cars/accord2020.jpg",
      additionalImages: [
        "/cars/accord2020a.jpg",
        "/cars/accord2020b.jpg",
        "/cars/accord2020c.jpg",
        "/cars/accord2020d.jpg",
        "/cars/accord2020e.jpg",
        "/cars/accord2020f.jpg",
        "/cars/accord2020i.jpg",
        "/cars/accord2020j.jpg"
      ],
      mileage: "47,267 miles",
      make: "Honda",
      model: "Accord",
      year: 2020,
      trim: "EX",
      condition: "Used",
      exteriorColor: "Blue",
      interiorColor: "Beige",
      transmission: "Automatic",
      drivetrain: "FWD",
      fuelType: "Gasoline",
      vin: "1HGCV1F49LA072295",
      safetyRating: "5/5 NHTSA safety rating",
      description: "Runs and drives good. Features include backup camera, blindspot monitor, lane departure warning. This vehicle is paid off."
    }, // Added comma here
    accord2015: {
      title: "2015 Honda Accord EX Sedan 4D",
      price: 9700,
      image: "/cars/accord2015.jpg",
      additionalImages: [
        "/cars/accord2015a.jpg",
        "/cars/accord2015b.jpg",
        "/cars/accord2015c.jpg",
        "/cars/accord2015d.jpg",
        "/cars/accord2015e.jpg",
        "/cars/accord2015f.jpg",
        "/cars/accord2015g.jpg",
        "/cars/accord2015h.jpg",
        "/cars/accord2015i.jpg",
        "/cars/accord2015j.jpg",
        "/cars/accord2015k.jpg",
        "/cars/accord2015l.jpg"
      ],
      mileage: "85,810 miles",
      make: "Honda",
      model: "Accord",
      year: 2015,
      trim: "EX",
      condition: "Used",
      exteriorColor: "White",
      interiorColor: "Tan",
      transmission: "Automatic",
      drivetrain: "FWD",
      fuelType: "Gasoline",
      vin: "1HGCR2F77FA165315",
      safetyRating: "5/5 overall NHTSA safety rating",
      description: "Runs and drives good. Features include backup camera, blindspot camera, moonroof, cloth seat. This vehicle is paid off."
    }
  };

  const vehicle = vehicleData[id];
  const images = vehicle ? [vehicle.image, ...(vehicle.additionalImages || [])] : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTestDriveSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Test drive scheduled:', testDriveForm);
    alert('Thank you! We will contact you shortly to confirm your test drive appointment.');
    setShowTestDriveModal(false);
    setTestDriveForm({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      comments: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestDriveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="single-vehicle">
      {vehicle ? (
        <>
          <div className="vehicle-header">
            <h1>{vehicle.title}</h1>
            <div className="price">${vehicle.price.toLocaleString()}</div>
          </div>

          <div className="vehicle-content">
            <div className="vehicle-images">
              <div className="vehicle-image-container">
                <button className="slider-button prev" onClick={previousImage}>&lt;</button>
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${vehicle.title} - View ${currentImageIndex + 1}`} 
                  className="main-image"
                />
                <button className="slider-button next" onClick={nextImage}>&gt;</button>
                <div className="image-counter">{currentImageIndex + 1} / {images.length}</div>
              </div>

              {images.length > 1 && (
                <div className="thumbnail-container">
                  {images.map((img, index) => (
                    <img
                      key={img}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="vehicle-details">
              <div className="detail-section">
                <h2>Vehicle Information</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="label">Make:</span>
                    <span className="value">{vehicle.make}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Model:</span>
                    <span className="value">{vehicle.model}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Year:</span>
                    <span className="value">{vehicle.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Trim:</span>
                    <span className="value">{vehicle.trim}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mileage:</span>
                    <span className="value">{vehicle.mileage}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Condition:</span>
                    <span className="value">{vehicle.condition}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Exterior Color:</span>
                    <span className="value">{vehicle.exteriorColor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Interior Color:</span>
                    <span className="value">{vehicle.interiorColor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Transmission:</span>
                    <span className="value">{vehicle.transmission}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Drivetrain:</span>
                    <span className="value">{vehicle.drivetrain}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Fuel Type:</span>
                    <span className="value">{vehicle.fuelType}</span>
                  </div>
                </div>
              </div>

              <div className="description-section">
                <h2>Description</h2>
                <p>{vehicle.description}</p>
              </div>

              <div className="cta-buttons">
                <button 
                  className="primary-btn" 
                  onClick={() => setShowTestDriveModal(true)}
                >
                  Schedule Test Drive
                </button>
              </div>
            </div>

            {showTestDriveModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Schedule a Test Drive</h2>
                  <h3>{vehicle.title}</h3>
                  <form onSubmit={handleTestDriveSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={testDriveForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={testDriveForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone:</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={testDriveForm.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferredDate">Preferred Date:</label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={testDriveForm.preferredDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferredTime">Preferred Time:</label>
                      <input
                        type="time"
                        id="preferredTime"
                        name="preferredTime"
                        value={testDriveForm.preferredTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="comments">Additional Comments:</label>
                      <textarea
                        id="comments"
                        name="comments"
                        value={testDriveForm.comments}
                        onChange={handleInputChange}
                        rows="4"
                      ></textarea>
                    </div>
                    <div className="modal-buttons">
                      <button type="submit" className="primary-btn">Schedule Test Drive</button>
                      <button 
                        type="button" 
                        className="secondary-btn" 
                        onClick={() => setShowTestDriveModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="not-found">Vehicle not found</div>
      )}
    </div>
  );
}

export default SingleVehicle;