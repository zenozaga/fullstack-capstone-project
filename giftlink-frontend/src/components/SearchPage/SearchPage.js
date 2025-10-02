import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { urlConfig } from "../../config";

import "./SearchPage.css";

const categories = ["Living", "Bedroom", "Bathroom", "Kitchen", "Office"];
const conditions = ["New", "Like New", "Older"];

function SearchPage() {
  const navigate = useNavigate();

  //Task 1: Define state variables for the search query, age range, and search results.
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState(6);
  const [searchResults, setSearchResults] = useState([]);

  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const fetchProducts = async () => {
    try {
      let url = new URL(`${urlConfig.backendUrl}/api/search`);

      // apply age range filter
      url.searchParams.append("age_years", ageRange);

      // apply category and condition filters if they are set
      if (category) url.searchParams.append("category", category);

      // apply condition filter if set
      if (condition) url.searchParams.append("condition", condition);

      // apply search query if not empty
      if (searchQuery && searchQuery.trim() !== "") {
        url.searchParams.append("name", searchQuery);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error; ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts().catch((error) => {
      console.error(error, " Fetching products failed");
    });
  }, []);

  /////////////////////
  /// Handlers
  /////////////////////

  // Task 2. Fetch search results from the API based on user inputs.
  const fetchSearchResults = () => {
    fetchProducts().catch((error) => {
      console.error(error, " Fetching products failed");
    });
  };

  const goToDetailsPage = (productId) => {
    // Task 6. Enable navigation to the details page of a selected gift.
    navigate(`/details/${productId}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getConditionClass = (condition) => {
    return condition === "New"
      ? "list-group-item-success"
      : "list-group-item-warning";
  };

  ///////////////////////
  /// Render
  ///////////////////////

  return (
    <div className="w-100 pt-5 row p-2 container mx-auto">
      <div className="col-md-3 pt-3">
        <div className="col-12 filters">
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>
            <div className="d-flex flex-column">
              {/* Task 3: Implement dropdowns for category and condition filters. */}
              <label className="form-label" htmlFor="categorySelect">
                Category
              </label>
              <select
                placeholder="Search by category"
                className="form-select mb-2"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <label className="form-label" htmlFor="conditionSelect">
                Condition
              </label>
              <select
                placeholder="Search by condition"
                className="form-select mb-2"
                value={condition}
                onChange={(e) => setCondition(e.target.value.trim())}
              >
                <option value="">All Conditions</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              {/* Task 4: Implement an age range slider and display the selected value. */}
              <label className="form-label" htmlFor="ageRange">
                Less then {ageRange} years
              </label>
              <input
                type="range"
                className="form-range mb-2"
                min="1"
                max="10"
                value={ageRange}
                placeholder="Search by max age"
                onChange={(e) => setAgeRange(parseInt(e.target.value))}
              />
            </div>
          </div>
          {/* Task 7: Add text input field for search criteria*/}
          <label className="form-label" htmlFor="searchInput">
            Search Gifts
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search gifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Task 8: Implement search button with onClick event to trigger search:*/}
          <button className="btn btn-primary" onClick={fetchSearchResults}>
            Search
          </button>
        </div>
      </div>
      <div className="col-md-9 px-lg-4">
        <div className="row justify-content-start">
          {searchResults.map((gift) => (
            <div key={gift.id} className="col-md-4 mb-4">
              <div className="card product-card">
                <div className="image-placeholder">
                  {gift.image ? (
                    <img src={gift.image} alt={gift.name} />
                  ) : (
                    <div className="no-image-available">No Image Available</div>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{gift.name}</h5>
                  <p
                    className={`card-text ${getConditionClass(gift.condition)}`}
                  >
                    {gift.condition}
                  </p>
                  <p className="card-text date-added">
                    {formatDate(gift.date_added)}
                  </p>
                </div>
                <div className="card-footer">
                  <button
                    onClick={() => goToDetailsPage(gift.id)}
                    className="btn btn-primary w-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
