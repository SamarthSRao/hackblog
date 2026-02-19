import React, { useState, useEffect } from 'react';

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
            <span className="score" id={`score_${story.id}`}>{story.score} points</span> by <a href="#" className="hnuser">{story.user}</a> <span className="age"><a href="#">{story.age}</a></span> | <a href="#">hide</a> | <a href="#">{story.comments} comments</a>
        </td>
    </tr>
);

export default function MainPage() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30');
                const data = await response.json();

                const formattedStories = data.hits.map((story, index) => ({
                    id: story.objectID,
                    rank: index + 1,
                    title: story.title,
                    source: getHostname(story.url),
                    score: story.points,
                    user: story.author,
                    age: timeAgo(story.created_at),
                    comments: story.num_comments,
                    url: story.url
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
                                                <b>Hacker News</b> new | past | comments | ask | show | jobs | submit | {' '}
                                                {localStorage.getItem('token') ? (
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        localStorage.removeItem('token');
                                                        localStorage.removeItem('user');
                                                        window.location.reload();
                                                    }}>logout</a>
                                                ) : (
                                                    <a href="/login">login</a>
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