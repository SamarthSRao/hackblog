import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onSearch }) {
    const navigate = useNavigate();
    const { currentTheme, setCurrentTheme, themes } = useTheme();

    const handleChange = (e) => {
        const query = e.target.value;
        if (onSearch) {
            onSearch(query);
        } else {
            navigate('/?search=' + query);
        }
    }
    return (
        <tr>
            <td colSpan="3">
                <br />
                <table width="100%" cellSpacing="0" cellPadding="1">
                    <tbody>
                        <tr><td style={{ backgroundColor: 'var(--header-color)' }}></td></tr>
                    </tbody>
                </table>
                <br />
                <center>
                    <span className="yclinks">
                        <a href="#">Guidelines</a> | <a href="#">FAQ</a> | <a href="#">Lists</a> | <a href="#">API</a> | <a href="#">Security</a> | <a href="#">Legal</a> | <a href="#">Apply to YC</a> | <a href="#">Contact</a>
                    </span>
                    <br /><br />
                    <div className="theme-switcher" style={{ fontSize: '9pt', color: 'var(--subtext-color)', marginBottom: '10px' }}>
                        Theme: {' '}
                        {Object.entries(themes).map(([key, theme], index) => (
                            <React.Fragment key={key}>
                                <button 
                                    onClick={() => setCurrentTheme(key)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: currentTheme === key ? 'var(--text-color)' : 'var(--accent-color)',
                                        textDecoration: currentTheme === key ? 'none' : 'underline',
                                        cursor: 'pointer',
                                        fontWeight: currentTheme === key ? 'bold' : 'normal',
                                        fontSize: '9pt'
                                    }}
                                >
                                    {theme.name}
                                </button>
                                {index < Object.keys(themes).length - 1 && ' | '}
                            </React.Fragment>
                        ))}
                    </div>
                    <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '1em' }}>
                        <span style={{ color: 'var(--subtext-color)' }}>Search: </span>
                        <input
                            type="text"
                            onChange={handleChange}
                            size="17"
                            autoCorrect="off"
                            spellCheck="false"
                            autoCapitalize="off"
                            autoComplete="off"
                            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--accent-color)' }}
                        />
                    </form>
                </center>
            </td>
        </tr>
    );
}