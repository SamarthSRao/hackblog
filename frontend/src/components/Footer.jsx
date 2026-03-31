import React from "react";

export default function Footer({ onSearch }) {
    return (
        <tr>
            <td colSpan="3" style={{ textAlign: 'center', paddingTop: '20px' }}>
                <center>
                    <hr style={{ width: '100%', color: '#828282', height: '1px', border: 'none', backgroundColor: '#828282' }} />
                    <span className="footer-links" style={{ fontSize: '10pt', color: '#828282' }}>
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Guidelines</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>FAQ</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Lists</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>API</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Security</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Legal</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Contact</a> | 
                        <a href="#" style={{ color: '#000', textDecoration: 'none' }}>Apply to YC</a>
                    </span>
                    <br /><br />
                    <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '1em' }}>
                        Search: <input 
                            type="text" 
                            onChange={(e) => onSearch(e.target.value)} 
                            placeholder="..." 
                            style={{ border: '1px solid #828282' }}
                        />
                    </form>
                </center>
            </td>
        </tr>
    );
}