import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storiesApi } from '../services/api';

const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach(comment => {
        map[comment.id] = { ...comment, children: [] };
    });

    flatComments.forEach(comment => {
        if (comment.parentId && map[comment.parentId]) {
            map[comment.parentId].children.push(map[comment.id]);
        } else {
            roots.push(map[comment.id]);
        }
    });

    return roots;
};

const CommentItem = ({ comment, depth = 0 }) => (
    <div style={{ marginLeft: `${depth * 20}px`, marginTop: '10px' }}>
        <div className="comhead" style={{ fontSize: '9pt', color: '#828282' }}>
            <a href={`/user/${comment.author}`} className="hnuser">{comment.author}</a>
            <span className="age"> {new Date(comment.createdAt).toLocaleString()} </span>
            | <a href="#">link</a>
        </div>
        <div style={{ marginTop: '2px', fontSize: '10pt' }}>{comment.content}</div>
        {comment.children && comment.children.map(child => (
            <CommentItem key={child.id} comment={child} depth={depth + 1} />
        ))}
    </div>
);

export default function CommentsPage() {
    const { postId } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await storiesApi.getById(postId);
                const data = response.data;

                // Build tree from flat comments
                const commentTree = buildCommentTree(data.comments || []);
                setStory({ ...data, children: commentTree });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    if (loading) return <div>Loading...</div>;
    if (!story) return <div>Story not found</div>;

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
                            <div className="title">
                                <a href={story.url} className="storylink" style={{ fontSize: '13pt', color: '#000000', textDecoration: 'none' }}>{story.title}</a>
                                {story.url && story.url.startsWith('http') && (
                                    <span className="sitebit comhead" style={{ fontSize: '8pt', color: '#828282' }}>
                                        ({new URL(story.url).hostname})
                                    </span>
                                )}
                            </div>
                            <div className="subtext" style={{ fontSize: '7pt', color: '#828282' }}>
                                {story.score} points by <a href={`/user/${story.author}`} className="hnuser">{story.author}</a> | {new Date(story.createdAt).toLocaleString()} | hide | {story.comments ? story.comments.length : 0} comments
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                {story.children && story.children.map(comment => (
                                    <CommentItem key={comment.id} comment={{ ...comment, depth: 0 }} />
                                ))}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    );
}