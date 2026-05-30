import TransactionForm from '../components/TransactionForm.jsx';
import TransactionTable from '../components/TransactionTable.jsx';

function ExpensePage({ transactionForm, setTransactionForm, onSubmit, expenses, totalExpense, onDelete, onEdit, onDownload, formatCurrency, formatDate, editMode, onCancelEdit }) {
  return (
    <section className="transaction-page">
      <div className="page-actions">
        <button type="button" className="download-btn" onClick={() => onDownload('expense')}>
          <span className="download-icon">⬇</span>
          <span className="download-label">Download Expense Excel</span>
        </button>
      </div>
      <TransactionForm type="expense" transactionForm={transactionForm} setTransactionForm={setTransactionForm} onSubmit={onSubmit} />
      {editMode && (
        <button type="button" className="secondary cancel-button" onClick={onCancelEdit}>
          Cancel edit
        </button>
      )}
      <TransactionTable
        type="expense"
        items={expenses}
        total={totalExpense}
        onDelete={onDelete}
        onEdit={onEdit}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </section>
  );
}

export default ExpensePage;
