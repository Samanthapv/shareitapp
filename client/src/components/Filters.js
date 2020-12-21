import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { getCategories } from "../services/requests";

export default function Filters() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ lat: 40.41677, lng: -3.70379 });
  const [sortBy, setSortBy] = useState("");
  const [condition, setCondition] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [distance, setDistance] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState(40.41677);
  const [lng, setLng] = useState(-3.70379);
  const [displayLocation, setDisplayLocation] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const history = useHistory();
  const location = useLocation();

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  useEffect(() => {
    // Get parsed params from url
    const parsed = queryString.parse(history.location.search);

    setSortBy(parsed.sort_by);
    setCondition(parsed.condition);
    setCategoryId(parsed.category_id);
    setDistance(parsed.distance);
    setFilters({ ...parsed, ...filters });

    // Get current position
    getUserLocation();

    // Get categories
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get user location
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude.toFixed(5));
        setLng(longitude.toFixed(5));
        setFilters({
          ...filters,
          lat: latitude.toFixed(5),
          lng: longitude.toFixed(5),
        });
      },
      (error) => {
        console.log(`ERROR(${error.code}): ${error.message}`);
      }
    );
  };

  // Set location to display
  useEffect(() => {
    getAddress();
  }, [lat, lng]);

  const getAddress = async () => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await res.json();

      let displayLocation = "";

      if (data.status === "OK") {
        displayLocation = data.plus_code.compound_code
          .split(" ")
          .slice(1)
          .join(" ");
      } else {
        displayLocation = "Location not found";
      }

      setDisplayLocation(displayLocation);
    } catch (error) {
      console.log(error);
    }
  };

  // Set location based on user input

  const setLocation = () => {
    setIsOpen(false);
    getCoords();
  };

  const getCoords = async () => {
    try {
      const formattedAddress = searchAddress.split(" ").join("+");

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`
      );
      const data = await res.json();

      setDisplayLocation(data.results[0].formatted_address);

      setFilters({
        ...filters,
        lat: data.results[0].geometry.location.lat.toFixed(5),
        lng: data.results[0].geometry.location.lng.toFixed(5),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Store filters

  const handleSelect = (e) => {
    const parsed = queryString.parse(location.search);

    // Delete search word from filters if it's not in the query string
    if (filters.q && !parsed.q) {
      filters.q = "";
    }

    // Grab selected values
    const { name, value } = e.target;

    // Ask location if distance filters are used
    if (name === "location" && value === "userLocation") {
      getUserLocation();
    } else {
      // Save selected value in filters
      setFilters({ ...filters, [name]: value });

      switch (name) {
        case "category_id":
          setCategoryId(value);
          break;
        case "condition":
          setCondition(value);
          break;
        case "distance":
          setDistance(value);
          break;
        case "sort_by":
          setSortBy(value);
          break;
      }
    }
  };

  // Fetch filtered products

  useEffect(() => {
    const queryParams = queryString.stringify(filters, {
      skipEmptyString: true,
    });

    history.push(`/search?${queryParams}`);
  }, [filters]);

  // Reset filters

  const resetFilters = () => {
    setCategoryId("");
    setCondition("");
    setSortBy("");
    setDistance("");
    setFilters({
      ...filters,
      category_id: "",
      condition: "",
      sort_by: "",
      distance: "",
    });
  };

  return (
    <div>
      <div className="py-3 pl-8 border-t border-b border-gray-500">
        <select
          className="w-64 border shadow-sm p-2 mr-3 rounded-full focus:outline-none"
          name="category_id"
          onChange={handleSelect}
          value={categoryId}
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="w-64 border shadow-sm p-2 mr-3 rounded-full focus:outline-none"
          name="condition"
          onChange={handleSelect}
          value={condition}
        >
          <option value="">Item condition</option>
          <option value="new">New</option>
          <option value="as good as new">As Good As New</option>
          <option value="good">Good</option>
          <option value="acceptable">Acceptable</option>
        </select>
        <select
          className="w-64 border shadow-sm p-2 mr-2 rounded-full focus:outline-none"
          name="distance"
          onChange={handleSelect}
          value={distance}
        >
          <option value="">Distance</option>
          <option value="5000">Up to 5 km</option>
          <option value="10000">Up to 10 km</option>
          <option value="30000">Up to 30 km</option>
          <option value="50000">Up to 50 km</option>
        </select>
        <select
          className="w-64 border shadow-sm p-2 mr-2 rounded-full focus:outline-none"
          name="sort_by"
          onChange={handleSelect}
          value={sortBy}
        >
          <option value="">Sort by</option>
          <option value="newest">Newest</option>
          <option value="distance">Distance</option>
        </select>
        <button
          onClick={resetFilters}
          title="Reset filters"
          className="ml-2 text-indigo-400 focus:outline-none"
        >
          <i className="far fa-times-circle"></i>
        </button>
      </div>
      <div className="py-1 pl-10 bg-indigo-400 text-white">
        <button
          className="focus:outline-none"
          title="Change location"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fas fa-map-marker-alt mx-2"></i>
          <span>{displayLocation}</span>
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 ml-12 mt-2 w-1/4 border rounded bg-white text-center">
          <div className="m-4">
            <input
              placeholder="Your address"
              onChange={(e) => setSearchAddress(e.target.value)}
              value={searchAddress}
              className="border w-full p-2 mb-6 rounded focus:outline-none"
              type="text"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={setLocation} className="btn btn-primary ml-2">
                Set location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}