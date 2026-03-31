import React, { useState, useEffect } from 'react';
import { storiesApi, votesApi } from './services/api';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './context/Authcontext';
import Footer from './components/Footer';

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

const StoryItem = ({ story, onVote }) => (
    <tr className='athing' id={story.id}>
        <td align="right" valign="top" className="title"><span className="rank">{story.rank}.</span></td>
        <td valign="top" className="votelinks">
            <center>
                <a
                    id={`up_${story.id}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onVote(story.id); }}
                >
                    <div className="votearrow" title="upvote"></div>
                </a>
            </center>
        </td>
        <td className="title">
            <a href={story.url} className="storylink">{story.title}</a>
            {story.source !== 'self' && <span className="sitebit comhead"> (<a href="#"><span className="sitestr">{story.source}</span></a>)</span>}
        </td>
    </tr>
);

const StorySubtext = ({ story }) => (
    <tr>
        <td colSpan="2"></td>
        <td className="subtext">
            <span className="score" id={`score_${story.id}`}>{story.score} points</span> by <a href={`/user/${story.userId}`} className="hnuser">{story.user}</a> <span className="age"><a href={`/comments/${story.id}`}>{story.age}</a></span> | <a href="#">hide</a> | <a href={`/comments/${story.id}`}>{story.comments} comments</a>
        </td>
    </tr>
);


export default function MainPage() {
    const [stories, setStories] = useState([]);
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [allStories, setAllStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
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
            setAllStories(formattedStories);
            setFilteredStories(formattedStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = allStories.filter(story =>
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.user.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredStories(filtered);
    }
    useEffect(() => {
        fetchStories();
    }, []);

    const handleVote = async (storyId) => {
        if (!localStorage.getItem('token')) {
            alert('Please login to vote');
            return;
        }

        try {
            const response = await votesApi.toggleVote({
                itemId: storyId,
                itemType: 'story',
                value: 1
            });

            // Update all lists locally to keep the score in sync immediately
            const updateStories = (prev) => prev.map(s => 
                s.id === storyId ? { ...s, score: s.score + response.data.scoreDelta } : s
            );

            setStories(updateStories);
            setAllStories(updateStories);
            setFilteredStories(updateStories);

        } catch (error) {
            console.error('Error voting:', error);
            alert('Failed to cast vote');
        }
    };


    return (
        <center>
            <table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%" bgcolor="#f6f6ef">
                <tbody>
                    <Header />
                    <tr style={{ height: '10px' }}></tr>
                    <tr>
                        <td>
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    {filteredStories.map((story) => (
                                        <React.Fragment key={story.id}>
                                            <StoryItem story={story} onVote={handleVote} />
                                            <StorySubtext story={story} />
                                            <tr className="spacer" style={{ height: '5px' }}></tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
                <Footer onSearch={handleSearch} />
            </table>
        </center>
    );
}