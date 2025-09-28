import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { urlConfig } from "../../config";

const categories = ["Living", "Bedroom", "Bathroom", "Kitchen", "Office"];
const conditions = ["New", "Like New", "Older"];

function SearchPage() {
  //Task 1: Define state variables for the search query, age range, and search results.
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState(null);
  const [condition, setCondition] = useState(null);

  useEffect(() => {
    // fetch all products
    const fetchProducts = async () => {
      try {
        let url = `${urlConfig.backendUrl}/api/gifts`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          //something went wrong
          throw new Error(`HTTP error; ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.log("Fetch error: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  // Task 2. Fetch search results from the API based on user inputs.
  const fetchSearchResults = async () => {
    try {
      let url = new URL(`${urlConfig.backendUrl}/api/search`);
      url.searchParams.append("query", searchQuery);
      url.searchParams.append("minAge", ageRange[0]);
      url.searchParams.append("maxAge", ageRange[1]);

      if (category) url.searchParams.append("category", category);
      if (condition) url.searchParams.append("condition", condition);

      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        //something went wrong
        throw new Error(`HTTP error; ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Fetch error: " + error.message);
    }
  };

  const navigate = useNavigate();

  const goToDetailsPage = (productId) => {
    // Task 6. Enable navigation to the details page of a selected gift.
    navigate(`/details/${productId}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>
            <div className="d-flex flex-column">
              <select
                placeholder="Search by condition"
                className="form-select mb-2"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Task 4: Implement an age range slider and display the selected value. */}
              <input
                type="range"
                className="form-range mb-2"
                min="0"
                max="100"
                value={ageRange[1]}
                placeholder="Search by max age"
                onChange={(e) => setAgeRange([0, parseInt(e.target.value)])}
              />
            </div>
          </div>
          {/* Task 7: Add text input field for search criteria*/}
          {/* Task 8: Implement search button with onClick event to trigger search:*/}
          {/*Task 5: Display search results and handle empty results with a message. */}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
