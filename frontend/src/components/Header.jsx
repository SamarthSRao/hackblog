import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const Header = () => {
    const { user, isLoggedIn, logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        window.location.href = '/';
    };

    return (
        <tr className="header-row">
            <td bgcolor="#d312b3ff">
                <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ padding: '2px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '18px', paddingRight: '4px' }}>
                                <Link to="/" style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                        width: '18px', 
                                        height: '18px', 
                                        backgroundColor: '#000', 
                                        color: '#fff', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontWeight: 'bold', 
                                        fontSize: '14px', 
                                        border: '1px white solid' 
                                    }}>
                                        S
                                    </div>
                                </Link>
                            </td>
                            <td style={{ lineHeight: '12pt' }}>
                                <span className="pagetop">
                                    <b className="hnname"><Link to="/" style={{ color: '#000', textDecoration: 'none' }}>Hacker News</Link></b>
                                    {' '}new | past | <Link to="/comments">comments</Link> | <Link to="/ask">ask</Link> | <Link to="/show">show</Link> | <Link to="/jobs">jobs</Link> | <Link to="/submit">submit</Link>
                                </span>
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '4px' }}>
                                <span className="pagetop">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to={`/user/${user.username}`}>{user.username}</Link> ({user.karma || 0}) |
                                            {' '}<a href="#" onClick={handleLogout}>logout</a>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">login</Link> | <Link to="/register">register</Link>
                                        </>
                                    )}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default Header;
