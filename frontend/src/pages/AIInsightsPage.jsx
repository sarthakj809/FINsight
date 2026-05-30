import { useEffect, useState } from 'react';
import { getAIInsights } from '../api';
import ReactMarkdown from 'react-markdown';

function extractScoreBlock(text) {
  if (!text) return { before: text, score: null, after: '' };
  const lines = text.split(/\r?\n/);
  const idx = lines.findIndex((l) => /financial score/i.test(l.trim()));
  if (idx === -1) return { before: text, score: null, after: '' };
  // find next non-empty line after header
  let j = idx + 1;
  while (j < lines.length && lines[j].trim() === '') j++;
  let scoreLine = lines[j] ? lines[j].trim() : null;
  if (scoreLine) {
    scoreLine = scoreLine.replace(/^\*+/, '').replace(/\*+$/, '').trim();
  }
  const before = lines.slice(0, idx).join('\n');
  const after = lines.slice(j + 1).join('\n');
  return { before, score: scoreLine, after };
}

function AIInsightsPage({ token, formatCurrency }) {

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {

    loadInsights();

  }, []);

  const loadInsights = async () => {

    setLoading(true);

    const result = await getAIInsights(token);

    if (result && result.success) {
      setData(result);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Generating AI Insights...</h2>
      </div>
    );
  }
  const raw = data?.insights || '';
  const parts = extractScoreBlock(raw);

  return (
    <section className="dashboard">

      <div className="card stats-card">

        <h2>AI Financial Insights</h2>

        <div className="stats-grid">

          <div>
            <h3>{formatCurrency(data?.stats?.totalIncome || 0)}</h3>
            <p>Total Income</p>
          </div>

          <div>
            <h3>{formatCurrency(data?.stats?.totalExpense || 0)}</h3>
            <p>Total Expense</p>
          </div>

          <div>
            <h3>{formatCurrency(data?.stats?.savings || 0)}</h3>
            <p>Savings</p>
          </div>

          <div>
            <h3>
              {data?.stats?.topCategory
                ? data.stats.topCategory[0]
                : 'None'}
            </h3>
            <p>Top Expense Category</p>
          </div>

        </div>

      </div>

      <div className="card ai-card">

        <h2>Gemini AI Analysis</h2>

        <div className="ai-content markdown-content">
          {parts.score ? (
            <>
              <ReactMarkdown>{parts.before}</ReactMarkdown>
              <div className="financial-block">
                <div className="financial-score">{parts.score}</div>
              </div>
              <ReactMarkdown>{parts.after}</ReactMarkdown>
            </>
          ) : (
            <ReactMarkdown>{raw}</ReactMarkdown>
          )}
        </div>

      </div>

    </section>
  );
}

export default AIInsightsPage;