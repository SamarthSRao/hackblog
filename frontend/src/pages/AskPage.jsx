import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { storiesApi } from '../services/api';
import { Link } from 'react-router-dom';

/**
 * AskPage
 * Displays stories starting with 'Ask HN'
 */
export default function AskPage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAskStories = async () => {
        try {
            const response = await storiesApi.getAskStories();
            setStories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ask stories:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAskStories();
    }, []);

    const timeAgo = (date) => {
        const d = new Date(date);
        return d.toLocaleString();
    };

    return (
        <center>
            <table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%" bgcolor="#f6f6ef">
                <tbody>
                    <Header />
                    <tr style={{ height: '10px' }}></tr>
                    <tr>
                        <td style={{ padding: '0 10px' }}>
                            <h2 style={{ fontSize: '13pt', color: '#000', marginBottom: '15px' }}>Ask HN</h2>
                            {loading ? (
                                <p style={{ fontSize: '9pt' }}>loading ask stories...</p>
                            ) : (
                                <table border="0" cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        {stories.length === 0 ? (
                                            <tr><td>No ask stories found.</td></tr>
                                        ) : (
                                            stories.map((story, index) => (
                                                <React.Fragment key={story.id}>
                                                    <tr className='athing'>
                                                        <td align="right" valign="top" className="title" style={{ paddingRight: '10px' }}>
                                                            <span className="rank">{index + 1}.</span>
                                                        </td>
                                                        <td className="title">
                                                            <Link to={`/comments/${story.id}`} className="storylink" style={{ fontSize: '10pt', color: '#000', textDecoration: 'none' }}>
                                                                {story.title}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="1"></td>
                                                        <td className="subtext" style={{ fontSize: '7pt', color: '#828282', paddingBottom: '10px' }}>
                                                            {story.score} points by <a href={`/user/${story.author}`} className="hnuser" style={{ color: '#828282', textDecoration: 'none' }}>{story.author}</a> | {timeAgo(story.createdAt)} | <Link to={`/comments/${story.id}`} style={{ color: '#828282', textDecoration: 'none' }}>{story.commentsCount || 0} comments</Link>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </td>
                    </tr>
                    <Footer />
                </tbody>
            </table>
        </center>
    );
}