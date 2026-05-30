import TransactionForm from '../components/TransactionForm.jsx';
import TransactionTable from '../components/TransactionTable.jsx';

function IncomePage({ transactionForm, setTransactionForm, onSubmit, incomes, totalIncome, onDelete, onEdit, onDownload, formatCurrency, formatDate, editMode, onCancelEdit }) {
  return (
    <section className="transaction-page">
      <div className="page-actions">
        <button type="button" className="download-btn" onClick={() => onDownload('income')}>
          <span className="download-icon">⬇</span>
          <span className="download-label">Download Income Excel</span>
        </button>
      </div>
      <TransactionForm type="income" transactionForm={transactionForm} setTransactionForm={setTransactionForm} onSubmit={onSubmit} />
      {editMode && (
        <button type="button" className="secondary cancel-button" onClick={onCancelEdit}>
          Cancel edit
        </button>
      )}
      <TransactionTable
        type="income"
        items={incomes}
        total={totalIncome}
        onDelete={onDelete}
        onEdit={onEdit}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </section>
  );
}

export default IncomePage;
