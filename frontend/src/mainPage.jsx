import React, { useState, useEffect } from 'react';
import { storiesApi } from './services/api';
import { Link } from 'react-router-dom';

const timeAgo = (date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const passed = new Date(date);

    // Calculate difference in seconds (negative for past)
    const seconds = Math.floor((passed - now) / 1000);

    // Define the breakdown of units
    const units = [
        { name: 'year', seconds: 31536000 },
        { name: 'month', seconds: 2592000 },
        { name: 'day', seconds: 86400 },
        { name: 'hour', seconds: 3600 },
        { name: 'minute', seconds: 60 },
        { name: 'second', seconds: 1 }
    ];

    for (const unit of units) {
        const interval = Math.floor(Math.abs(seconds) / unit.seconds);
        if (interval >= 1) {
            // Calculate the relative value (e.g., -5 for 5 days ago)
            const value = Math.floor(seconds / unit.seconds);
            return rtf.format(value, unit.name);
        }
    }
    return "just now";
};

const getHostname = (url) => {
    try {
        return new URL(url).hostname;
    } catch (e) {
        return "";
    }
}

const StoryItem = ({ story }) => (
    <tr className='athing' id={story.id}>
        <td align="right" valign="top" className="title"><span className="rank">{story.rank}.</span></td>
        <td valign="top" className="votelinks"><center><a id={`up_${story.id}`} href="#"><div className="votearrow" title="upvote"></div></a></center></td>
        <td className="title"><a href={story.url} className="storylink">{story.title}</a><span className="sitebit comhead"> (<a href="#"><span className="sitestr">{story.source}</span></a>)</span></td>
    </tr>
);

const StorySubtext = ({ story }) => (
    <tr>
        <td colSpan="2"></td>
        <td className="subtext">
            <span className="score" id={`score_${story.id}`}>{story.score} points</span> by <a href={`/user/${story.userId}`} className="hnuser">{story.user}</a> <span className="age"><a href="#">{story.age}</a></span> | <a href="#">hide</a> | <a href={`/comments/${story.id}`}>{story.comments} comments</a>
        </td>
    </tr>
);


export default function MainPage() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storiesApi.getStories();
                const data = response.data; // Axios response data

                const formattedStories = data.map((story, index) => ({
                    id: story.id,
                    rank: index + 1,
                    title: story.title,
                    source: story.url ? getHostname(story.url) : 'self',
                    score: story.score || 0,
                    user: story.author || 'unknown',
                    userId: story.author || 'unknown',
                    age: timeAgo(story.createdAt),
                    comments: story.commentsCount || 0,
                    url: story.url || `/comments/${story.id}`
                }));

                setStories(formattedStories);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };

        fetchStories();
    }, []);


    return (
        <center>
            <table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%">
                <tbody>
                    <tr className="header-row">
                        <td bgcolor="#d312b3ff">
                            <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ padding: '2px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '18px', paddingRight: '4px' }}>
                                            <img src="y18.svg" width="18" height="18" style={{ border: '1px white solid' }} alt="logo" />
                                        </td>
                                        <td style={{ lineHeight: '12pt' }}>
                                            <span className="pagetop">
                                                <b>Hacker News</b> new | past | comments | ask | show | jobs | <Link to="/submit">submit</Link> | {' '}
                                                {localStorage.getItem('token') ? (
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        localStorage.removeItem('token');
                                                        localStorage.removeItem('user');
                                                        window.location.reload();
                                                    }}>logout</a>
                                                ) : (
                                                    <React.Fragment>
                                                        <a href="/login">login</a> | <a href="/register">register</a>
                                                    </React.Fragment>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr>
                        <td>
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    {stories.map((story) => (
                                        <React.Fragment key={story.id}>
                                            <StoryItem story={story} />
                                            <StorySubtext story={story} />
                                            <tr className="spacer" style={{ height: '5px' }}></tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    );
}