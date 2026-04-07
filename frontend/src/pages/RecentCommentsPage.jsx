import React, { useState, useEffect } from 'react';
import { commentsApi } from '../services/api';

export default function RecentCommentsPage() {
    const [commentsPage, setCommentsPage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommentsPage = async () => {
            try {
                const response = await commentsApi.getCommentsPage();
                // Axios returns data in .data
                setCommentsPage(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching comments page:', error);
                setLoading(false);
            }
        };
        fetchCommentsPage();
    }, []);

    return (
        <div>
            <h1>Recent Comments</h1>
            {loading ? (
                <p>loading comments...</p>
            ) : (
                commentsPage.map((comment) => (
                    <div key={comment.id} className="comment" style={{ marginBottom: '15px' }}>
                        <p>{comment.content}</p>
                        {/* Use optional chaining ?. in case data isn't joined yet */}
                        <p>by {comment.author?.username || 'unknown'}</p>
                        <p>on {comment.story?.title || 'unknown post'}</p>
                        <p>at {new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}
