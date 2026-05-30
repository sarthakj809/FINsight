const categories = ['Food', 'Salary', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];

function TransactionForm({ type, transactionForm, setTransactionForm, onSubmit }) {
  return (
    <div className="card form-card">
      <h2>Add {type === 'income' ? 'Income' : 'Expense'}</h2>
      <label>
        Description
        <input
          value={transactionForm.description}
          onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
          placeholder="Description"
        />
      </label>
      <label>
        Amount
        <input
          type="number"
          min="0"
          step="0.01"
          value={transactionForm.amount}
          onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
          placeholder="0.00"
        />
      </label>
      <label>
        Category
        <select
          value={transactionForm.category}
          onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input
          type="date"
          value={transactionForm.date}
          onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
        />
      </label>
      <button type="button" className="primary" onClick={onSubmit}>
        Save {type === 'income' ? 'Income' : 'Expense'}
      </button>
    </div>
  );
}

export default TransactionForm;
