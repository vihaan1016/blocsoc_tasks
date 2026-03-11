import { Link } from "react-router";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ExpenseCard = ({ expense, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await api.delete(`/${expense._id}`);
      toast.success("Expense deleted");
      onDelete(expense._id);
    } catch (error) {
      console.log("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="card-title text-lg">{expense.type}</h3>
            <p className="text-sm text-base-content/70">{expense.description}</p>
            <p className="text-2xl font-bold text-primary mt-2">₹{expense.amount}</p>
            <p className="text-xs text-base-content/50 mt-2">
              {new Date(expense.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="card-actions justify-end gap-2 mt-4">
          <Link to={`/expense/${expense._id}`} className="btn btn-sm btn-ghost">
            <Edit2Icon className="h-4 w-4" />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-sm btn-error btn-outline">
            <Trash2Icon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
