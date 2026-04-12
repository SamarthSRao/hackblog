import React from "react";
import { useNavigate } from 'react-router-dom';

export default function Footer({ onSearch }) {
    const navigate = useNavigate();

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
                        <tr><td bgcolor="#ff2d55"></td></tr>
                    </tbody>
                </table>
                <br />
                <center>
                    <span className="yclinks">
                        <a href="#">Guidelines</a> | <a href="#">FAQ</a> | <a href="#">Lists</a> | <a href="#">API</a> | <a href="#">Security</a> | <a href="#">Legal</a> | <a href="#">Apply to YC</a> | <a href="#">Contact</a>
                    </span>
                    <br /><br />
                    <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '1em' }}>
                        <span style={{ color: '#888' }}>Search: </span>
                        <input
                            type="text"
                            onChange={handleChange}
                            size="17"
                            autoCorrect="off"
                            spellCheck="false"
                            autoCapitalize="off"
                            autoComplete="off"
                            style={{ backgroundColor: '#ffffff', color: '#000', border: '1px solid #ff2d55' }}
                        />
                    </form>
                </center>
            </td>
        </tr>
    );
}