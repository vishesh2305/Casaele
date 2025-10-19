import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

/**
 * A flexible component to render content from the CMS.
 * @param {string} slug - The unique identifier for the content block in the CMS.
 * @param {React.ElementType} [as='div'] - The HTML tag to use as the wrapper (e.g., 'h1', 'p').
 * @param {boolean} [prose=true] - Whether to apply Tailwind's typography styling.
 * @param {string} [className=''] - Additional CSS classes to apply to the wrapper.
 * @param {React.ReactNode} [children] - Fallback content to display if nothing is fetched from the CMS.
 */
function CmsContent({ slug, as: Component = 'div', prose = true, className = '', children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const result = await apiGet(`/api/cms/slug/${slug}`);
        setData(result);
      } catch (err) {
        // If content is not found (404), we'll just use the fallback children.
        // We don't need to show an error on the public page.
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  // While loading, show a subtle placeholder to prevent layout shifts.
  if (loading) {
    return <Component className={`animate-pulse bg-gray-200 rounded-md ${className}`}>&nbsp;</Component>;
  }

  // Use the fetched content, or the fallback children if fetch failed or content is empty.
  const contentToRender = data?.content || children;

  if (!contentToRender) {
    return null; // Render nothing if there's no content and no fallback.
  }

  const proseClass = prose ? 'prose lg:prose-lg max-w-none' : '';
  const finalClassName = `${proseClass} ${className}`.trim();

  // Render the content using the specified component tag.
  return <Component className={finalClassName} dangerouslySetInnerHTML={{ __html: contentToRender }} />;
}

export default CmsContent;