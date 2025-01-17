import { useEffect, useState } from 'react';
    import nlp from 'compromise';

    export default function InsightsPanel({ document }) {
      const [insights, setInsights] = useState({
        summary: '',
        topics: [],
        connections: []
      });

      useEffect(() => {
        if (document) {
          const doc = nlp(document.content);
          setInsights({
            summary: doc.sentences().slice(0, 3).out('text'),
            topics: doc.topics().out('array'),
            connections: doc.match('#Person').out('array')
          });
        }
      }, [document]);

      return (
        <div className="insights-panel">
          <h3>Insights</h3>
          <div className="summary">
            <h4>Summary</h4>
            <p>{insights.summary}</p>
          </div>
          <div className="topics">
            <h4>Key Topics</h4>
            <ul>
              {insights.topics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
