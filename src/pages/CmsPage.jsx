import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../utils/api';

function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetches the page data from your backend using the slug from the URL
        const data = await apiGet(`/api/cms/slug/${slug}`);
        setPage(data);
      } catch (err) {
        setError('Page not found. Please check the URL and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]); // This will re-run whenever the slug in the URL changes

  if (loading) {
    return <div className="text-center p-20 font-semibold">Loading Page...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 border-b pb-4">
          {page.title}
        </h1>
        {/* This safely renders the HTML content from your CMS editor */}
        <div 
          className="prose lg:prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </div>
  );
}

export default CmsPage;