import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const ExpenseNotFound = () => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-base-content/70 mb-2">No Expenses Yet</h2>
        <p className="text-base-content/50 mb-6">Start tracking your expenses by creating a new one</p>
      </div>
      <Link to="/create" className="btn btn-primary">
        <PlusIcon className="h-5 w-5" />
        Create Expense
      </Link>
    </div>
  );
};

export default ExpenseNotFound;
