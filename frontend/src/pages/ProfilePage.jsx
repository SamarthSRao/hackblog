import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../services/api';

export default function ProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getUserProfile(userId);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <center>
            <table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%" bgcolor="#f6f6ef">
                <tbody>
                    <tr>
                        <td bgcolor="#d312b3ff">
                            <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ padding: '2px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '18px', paddingRight: '4px' }}>
                                            <a href="/"><img src="/y18.svg" width="18" height="18" style={{ border: '1px white solid' }} alt="logo" /></a>
                                        </td>
                                        <td style={{ lineHeight: '12pt' }}>
                                            <span className="pagetop">
                                                <b className="hnname"><a href="/">Hacker News</a></b>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr>
                        <td style={{ padding: '0 10px' }}>
                            <table border="0">
                                <tbody>
                                    <tr><td>user:</td><td>{user.username}</td></tr>
                                    <tr><td>created:</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>
                                    <tr><td>karma:</td><td>{user.karma}</td></tr>
                                    <tr><td>about:</td><td dangerouslySetInnerHTML={{ __html: user.about || '' }}></td></tr>
                                </tbody>
                            </table>
                            <br />

                            <div style={{ marginTop: '20px' }}>
                                <b>Submissions</b>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {user.stories && user.stories.map(story => (
                                        <li key={story.id} style={{ marginBottom: '5px' }}>
                                            <a href={story.url || `/comments/${story.id}`} style={{ textDecoration: 'none', color: '#000' }}>{story.title}</a>
                                            <span style={{ fontSize: '7pt', color: '#828282', marginLeft: '5px' }}>
                                                ({story.score} points | {new Date(story.createdAt).toLocaleDateString()})
                                            </span>
                                        </li>
                                    ))}
                                    {(!user.stories || user.stories.length === 0) && <li style={{ color: '#828282' }}>No submissions yet.</li>}
                                </ul>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <b>Comments</b>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {user.comments && user.comments.map(comment => (
                                        <li key={comment.id} style={{ marginBottom: '10px', fontSize: '10pt' }}>
                                            <div style={{ color: '#828282', fontSize: '8pt' }}>
                                                on story <a href={`/comments/${comment.storyId}`} style={{ color: '#828282' }}>{comment.storyId}</a> | {new Date(comment.createdAt).toLocaleString()}
                                            </div>
                                            <div style={{ color: '#000' }}>{comment.content}</div>
                                        </li>
                                    ))}
                                    {(!user.comments || user.comments.length === 0) && <li style={{ color: '#828282' }}>No comments yet.</li>}
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    );
}