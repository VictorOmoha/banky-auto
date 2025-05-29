import React, { useState } from 'react';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample car data - you should replace this with real data from your backend
  const sampleCars = [
    {
      id: 'pilot2020',
      title: "2020 Honda Pilot EX-L Sport Utility 4D",
      price: 17500,
      image: "/cars/pilot2020.jpg",
      mileage: "65,458 miles",
      shipping: "Free Shipping",
      delivery: "Get it Monday",
      path: "/inventory/pilot2020"
    },
    {
      id: 'camry2023',
      title: "2023 Toyota Camry SE",
      price: 22990,
      image: "/cars/camry.jpeg",
      mileage: "624 miles",
      shipping: "Free Shipping",
      delivery: "Get it Monday",
      path: "/inventory/camry2023"
    },
    {
      id: 'civic2022',
      title: "2022 Honda Civic",
      price: 21990,
      image: "/cars/civic2022.jpeg",
      mileage: "15k miles",
      shipping: "Free Shipping",
      delivery: "Get it Sunday",
      path: "/inventory/civic2022"
    },
    {
      id: 'pilot2021',
      title: "2021 Honda Pilot",
      price: 28990,
      image: "/cars/pilot2021.jpeg",
      mileage: "32k miles",
      shipping: "Free Shipping",
      delivery: "Get it Monday",
      path: "/inventory/pilot2021"
    },
    {
      id: 'accord2020',
      title: "2020 Honda Accord EX Sedan 4D",
      price: 14200,
      image: "/cars/accord2020.jpg",
      mileage: "47,267 miles",
      shipping: "Free Shipping",
      delivery: "Get it Monday",
      path: "/inventory/accord2020"
    },
    {
      id: 'accord2015',
      title: "2015 Honda Accord EX Sedan 4D",
      price: 9700,
      image: "/cars/accord2015.jpg",
      mileage: "85,810 miles",
      shipping: "Free Shipping",
      delivery: "Get it Monday",
      path: "/inventory/accord2015"
    }
  ];

  const reviews = [
    {
      id: 1,
      name: "Michael",
      date: "August 29, 2024",
      rating: 5,
      notable: ["Communication", "Pricing"],
      content: "Responded quickly to questions and was very accommodating with multiple visits to look over the vehicle. Was VERY IMPRESSED that he addressed something we were concerned about in less than 24 hrs. Easy to do business with and I would recommend if he has a vehicle that fits your needs."
    },
    {
      id: 2,
      name: "Jenny",
      date: "May 20, 2024",
      rating: 5,
      notable: ["Punctuality", "Communication", "Pricing", "Item Description"],
      content: "Everything was excellent!!"
    },
    {
      id: 3,
      name: "Lynwood",
      date: "October 17, 2024",
      rating: 5,
      notable: ["Punctuality", "Communication", "Pricing", "Item Description"],
      content: "Great experience,very honest gentleman would highly recommend buying car from this car place. Best experience in 40 years!"
    },
    {
      id: 4,
      name: "Richard",
      date: "October 10, 2024",
      rating: 5,
      notable: ["Punctuality", "Communication", "Pricing", "Item Description"],
      content: "He is a honest business man. The vehicle I purchased exceeded my expectation. He is very knowledgeable person and very fair with his pricing. I plan on purchasing from him again. I highly recommend him."
    },
    {
      id: 5,
      name: "John",
      date: "February 21, 2025",
      rating: 5,
      notable: ["Communication"],
      content: "I didn't purchase vehicle but the communications was outstanding."
    },
    {
      id: 6,
      name: "Carlton",
      date: "November 23, 2024",
      rating: 5,
      notable: ["Punctuality", "Communication", "Pricing", "Item Description"],
      content: "My purchase was as described. Vehicle was exactly as listed and passed both a professional mechanic and personal inspection. Vehicle was priced to sell (and I bought it). I was very happy with the overall experience with Oladimeji. He was very patient and answered all my questions, as well addressed all my concerns. Look forward to do business with him in the future."
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Create a search-friendly version of the query
      const formattedQuery = searchQuery.trim().toLowerCase();
      
      // First check if the search matches any of our sample cars
      const matchingCar = sampleCars.find(car => {
        const searchableText = `${car.title} ${car.mileage}`.toLowerCase();
        return searchableText.includes(formattedQuery);
      });

      if (matchingCar) {
        // If we find a direct match, navigate to that car's page
        navigate(matchingCar.path);
      } else {
        // If no direct match, navigate to inventory with search query
        navigate(`/inventory?search=${encodeURIComponent(formattedQuery)}`);
      }
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Next Ride at Banky Auto</h1>
        <p>Explore our curated selection of quality salvage vehicles. Each vehicle has been carefully inspected and documented.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by make, model, or year..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <button 
          className="start-journey-button"
          onClick={() => navigate('/inventory')}
        >
          Start Your Journey
        </button>
      </div>

      <div className="featured-cars">
        <h2>Featured Vehicles</h2>
        <div className="car-grid">
          {sampleCars.map(car => (
            <Link to={car.path} key={car.id} className="car-card">
              <img src={car.image} alt={car.title} />
              <div className="car-details">
                <h3>{car.title}</h3>
                <div className="car-meta">
                  <span>{car.mileage}</span>
                  <span>{car.shipping}</span>
                </div>
                <div className="car-price">${car.price.toLocaleString()}</div>
                <button className="view-details">View Details</button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="customer-reviews">
        <h2>What Our Customers Say</h2>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <h3>{review.name}</h3>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
              <div className="notable-tags">
                {review.notable.map((tag, index) => (
                  <span key={index} className="tag">Notable: {tag}</span>
                ))}
              </div>
              <p className="review-content">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;