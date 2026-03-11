import { useState } from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseNotFound from "../components/ExpenseNotFound";

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/");
        console.log(res.data);
        setExpenses(res.data);
      } catch (error) {
        console.log("Error fetching expenses");
        console.log(error.response);
        toast.error("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense._id !== id));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading expenses...</div>}

        {expenses.length === 0 && <ExpenseNotFound />}

        {expenses.length > 0  && (
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