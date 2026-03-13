import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseNotFound from "../components/ExpenseNotFound";

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [availableTypes, setAvailableTypes] = useState([]);

  const fetchExpenses = async (type = "All") => {
    setLoading(true);
    try {
      let res;
      if (type && type !== "All") {
        res = await api.get(`/type/${encodeURIComponent(type)}`);
      } else {
        res = await api.get("/");
      }
      console.log(res.data);
      setExpenses(res.data);

      if (type === "All") {
        const types = Array.from(new Set(res.data.map((e) => e.type))).sort();
        setAvailableTypes(types);
      }
    } catch (error) {
      console.log("Error fetching expenses");
      console.log(error.response);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchExpenses(filterType);
  }, [filterType]);

  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense._id !== id));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="typeFilter" className="font-medium">
            Filter by category:
          </label>
          <select
            id="typeFilter"
            className="select select-bordered"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {loading && <div className="text-center text-primary py-10">Loading expenses...</div>}

        {expenses.length === 0 && <ExpenseNotFound />}

        {expenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expenses.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;