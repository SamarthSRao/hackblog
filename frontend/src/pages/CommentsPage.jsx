import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { storiesApi, votesApi, commentsApi } from '../services/api';
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

const CommentItem = ({ comment, depth = 0, rootId, onReply, onVote }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        await onReply(replyText, comment.id);
        setReplyText('');
        setIsReplying(false);
    };

    return (
        <div id={`comment-${comment.id}`} style={{ marginLeft: `${depth * 20}px`, marginTop: '10px' }}>
            <div className="comhead" style={{ fontSize: '9pt', color: '#828282' }}>
                <span
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => onVote(comment.id)}
                    title="upvote"
                >
                    ▲
                </span>
                <a href={`/user/${comment.author}`} className="hnuser">{comment.author}</a>
                <span className="age"> {new Date(comment.createdAt).toLocaleString()} </span>
                {comment.parentId && (
                    <>
                        | <a href={`#comment-${comment.parentId}`} style={{ color: '#828282', textDecoration: 'none' }}>parent</a>
                        | <a href={`#comment-${rootId}`} style={{ color: '#828282', textDecoration: 'none' }}>root</a>
                    </>
                )}
                | <span style={{ cursor: 'pointer' }} onClick={() => setIsReplying(!isReplying)}>reply</span>
                {comment.score !== undefined && ` | ${comment.score} points`}
            </div>
            <div style={{ marginTop: '2px', fontSize: '10pt', color: '#000' }}>{comment.content}</div>

            {isReplying && (
                <form onSubmit={handleSubmitReply} style={{ marginTop: '10px' }}>
                    <textarea
                        rows="4"
                        cols="60"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ display: 'block', marginBottom: '5px' }}
                    ></textarea>
                    <button type="submit" style={{ fontSize: '8pt' }}>reply</button>
                    <button type="button" onClick={() => setIsReplying(false)} style={{ fontSize: '8pt', marginLeft: '5px' }}>cancel</button>
                </form>
            )}

            {comment.children && comment.children.map(child => (
                <CommentItem key={child.id} comment={child} depth={depth + 1} rootId={rootId || comment.id} onReply={onReply} onVote={onVote} />
            ))}
        </div>
    );
};

export default function CommentsPage() {
    const { postId } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await storiesApi.getById(postId);
            const data = response.data;
            const commentTree = buildCommentTree(data.comments || []);
            setStory({ ...data, children: commentTree });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        if (e) e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await commentsApi.createComment({
                storyId: postId,
                content: newComment
            });
            setNewComment('');
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Are you logged in?');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (content, parentId) => {
        try {
            await commentsApi.createComment({
                storyId: postId,
                content: content,
                parentId: parentId
            });
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error replying to comment:', error);
            alert('Failed to reply. Are you logged in?');
        }
    };

    const handleVoteComment = async (commentId) => {
        if (!localStorage.getItem('token')) {
            alert('Please login to vote');
            return;
        }

        try {
            const response = await votesApi.toggleVote({
                itemId: commentId,
                itemType: 'comment',
                value: 1
            });

            // Refresh comments to show new score
            await fetchComments();
        } catch (error) {
            console.error('Error voting on comment:', error);
            alert('Failed to cast vote');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!story) return <div>Story not found</div>;

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <center>
            <table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%" bgcolor="#f6f6ef">
                <tbody>
                    <Header />
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

                            {isLoggedIn ? (
                                <div style={{ marginTop: '15px', marginBottom: '20px' }}>
                                    <form onSubmit={handleAddComment}>
                                        <textarea
                                            rows="6"
                                            cols="80"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            style={{ display: 'block', marginBottom: '10px' }}
                                        ></textarea>
                                        <button type="submit" disabled={submitting}>
                                            {submitting ? 'Adding...' : 'add comment'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div style={{ marginTop: '15px', marginBottom: '20px', fontSize: '9pt' }}>
                                    <a href="/login">Login</a> to add a comment
                                </div>
                            )}

                            <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                                {story.children && story.children.map(comment => (
                                    <CommentItem key={comment.id} comment={comment} depth={0} rootId={comment.id} onReply={handleReply} onVote={handleVoteComment} />
                                ))}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    );
}