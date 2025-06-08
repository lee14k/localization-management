import React, { useMemo } from 'react';

export function highlightText(
  text: string, 
  searchQuery: string, 
  className: string = 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded'
): React.ReactElement {

  if (!searchQuery || !searchQuery.trim()) {
    return <>{text}</>;
  }

  const query = searchQuery.trim();
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        
        return isMatch ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

export function useTextHighlighter(
  searchQuery?: string, 
  className?: string
) {
  return useMemo(() => {
    return (text: string) => highlightText(text, searchQuery || '', className);
  }, [searchQuery, className]);
}


function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function HighlightText({ 
  text, 
  searchQuery, 
  className 
}: { 
  text: string; 
  searchQuery?: string; 
  className?: string;
}): React.ReactElement {
  return highlightText(text, searchQuery || '', className);
} 