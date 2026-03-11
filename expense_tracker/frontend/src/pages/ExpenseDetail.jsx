import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const ExpenseDetail = () => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/${id}`);
        setExpense(res.data);
      } catch (error) {
        console.log("Error in fetching expense", error);
        toast.error("Failed to fetch the expense");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/${id}`);
      toast.success("Expense deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleSave = async () => {
    if (!expense.amount || !expense.type.trim() || !expense.description.trim()) {
      toast.error("Please add an amount, category, and description before saving");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/${id}`, expense);
      toast.success("Expense updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the expense:", error);
      toast.error("Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-center text-base-content/70">Expense not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Expenses
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Expense
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={expense.amount}
                  onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food, Transport, Entertainment"
                  className="input input-bordered"
                  value={expense.type}
                  onChange={(e) => setExpense({ ...expense, type: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Write your expense details here..."
                  className="textarea textarea-bordered h-32"
                  value={expense.description}
                  onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpenseDetail;