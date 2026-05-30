function TransactionTable({ type, items, total, onDelete, onEdit, formatCurrency, formatDate }) {
  return (
    <div className="card table-card">
      <h2>{type === 'income' ? 'Income Transactions' : 'Expense Transactions'}</h2>
      <div className="summary-row">
        <div>{type === 'income' ? 'Total Income' : 'Total Expense'}</div>
        <strong>{total}</strong>
      </div>
      <div className="list">
        {items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.description}</strong>
              <p>{item.category} • {formatDate(item.date)}</p>
            </div>
            <div className="item-actions">
              <span>{formatCurrency(item.amount)}</span>
              <button type="button" onClick={() => onEdit(item)}>Edit</button>
              <button type="button" onClick={() => onDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
        {!items.length && <p className="empty-state">No transactions yet.</p>}
      </div>
    </div>
  );
}

export default TransactionTable;
