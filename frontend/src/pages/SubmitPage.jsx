import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storiesApi } from "../services/api";


export default function SubmitPage() {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await storiesApi.createStory({ title, url, text });
            navigate("/");
        } catch (error) {
            console.error('Error creating story:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };
    return (
        <center>
            <table border="0" cellPadding="0" cellSpacing="0" width="85%">
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #ff00c8ff', padding: '10px' }}>
                            <form onSubmit={handleSubmit}>

                                <table border="0" cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td style={{ paddingRight: '4px' }}>Title:</td>
                                            <td><input type="text" name="title" size="60"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)} /></td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingRight: '4px' }}>URL:</td>
                                            <td><input type="text" name="url" size="60"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)} /></td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingRight: '4px' }}>Text:</td>
                                            <td><textarea name="text" rows="6" cols="60"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}></textarea></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><input type="submit" value="submit" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    );
}