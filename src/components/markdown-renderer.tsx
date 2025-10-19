'use client';

import React from 'react';

type MarkdownRendererProps = {
  content: string;
};

// This component now just renders the HTML provided by the AI.
const SimpleMarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  // Basic styling for the container and elements within.
  // The AI is instructed to provide simple HTML tags.
  const style = `
    .prose h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .prose p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    .prose ul {
      list-style-type: disc;
      margin-left: 1.25rem;
      margin-bottom: 1rem;
    }
    .prose li {
      margin-bottom: 0.25rem;
    }
    .prose strong {
      font-weight: 700;
    }
    .prose em {
      font-style: italic;
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

export default SimpleMarkdownRenderer;
