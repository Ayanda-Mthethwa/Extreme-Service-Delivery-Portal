import React from "react";
import { useEffect, useState } from "react";
import '../scss/welcomePage.scss';
import logo from '../assets/emalahleni.png';
import playstore from '../assets/playstore.png';
import { Link as ScrollLink} from 'react-scroll';
import { Link } from 'react-router-dom';
import loadingImg from '../assets/esdl2.png';
import about from '../assets/about-img.png';

function Welcome() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        setTimeout(() => {
            setIsLoading(false);
        }, 3000); 
    }, []);

    if (isLoading) {
        return (
            <div className="loading-screen">
                <img src={loadingImg} alt="Loading..." className="loading-image" />
            </div>
        );
    }
    return(
        <>
        <div className="welcome-body">

        <section id="hero">

            <div className="welcome-section-box">

                <div className="content-wrap">

                    <header className="welcome-header">
                        <a className="header-logo"><img src={logo} className="header-logo"/></a>

                        <nav className="welcome-nav">
                            <Link to='/' onClick={() => window.location.reload()}><a className="welcome-nav-items active">Home</a></Link>
                            <ScrollLink to='about' smooth={true} duration={500} className="welcome-nav-items">about us</ScrollLink>
                            <ScrollLink to='contact-us' smooth={true} duration={500} className="welcome-nav-items">contact us</ScrollLink>
                            <Link to='/login'><a className="welcome-nav-items"><button className="login-btn">Login</button></a></Link>
                        </nav>

                    </header>

                    <div className="hero-content">
                        <h3>Extreme Service Delivery Portal</h3>

                        <img src={logo} className="hero-img"/>
                        <Link to='/signup'><button className="hero-btn">Sign Up</button></Link>

                        <div className="download-div">
                            {/* <img src={playstore} className="download-image"/> */}
                            <button className="download-btn">DOWNLOAD APK VERSION</button>
                        </div>
                        

                    </div>

                </div>

            </div>

        </section>

        <section className='about' id="about">

            <div className="welcome-section-box">

                <div className="content-grid">

                    <div className="left-grid">
                        <h3 className="section-sub">About us</h3>
                        <h2 className="section-title">Who are we?</h2>

                        <h2 className="vm-title">Our Mission</h2>
                        <p>
                        At Extreme Service Delivery, our mission is to provide exceptional
                        and efficient services to our community. We strive to enhance the
                        quality of life by addressing key issues swiftly and effectively.
                        </p>

                        <h2 className="vm-title">Our Team</h2>
                        <p>
                        Our dedicated team is composed of passionate individuals with a
                        shared commitment to improving community services. From our
                        administrative staff to our field agents, everyone plays a crucial
                        role in ensuring the smooth operation of our services.
                        </p>

                        <h2 className="vm-title">Our Values</h2>
                        <ul>
                        <li>Integrity: We uphold the highest standards of honesty and transparency.</li>
                        <li>Commitment: We are dedicated to delivering the best service possible.</li>
                        <li>Innovation: We continuously seek to improve our processes and solutions.</li>
                        <li>Customer Focus: We prioritize the needs and satisfaction of our users.</li>
                        </ul>

                    </div>

                    <div className="right-grid">
                        <img src={about} className="about-img"/>
                    </div>
                </div>

            </div>

        </section>

        <section id="contact-us">

            <div className="welcome-section-box">

                <div className="content-wrap">
                    <h3 className="section-sub">One Report at a time</h3>
                    <h2 className="section-title">Contact Us</h2>

                <div class="join-form">
                    <input type="text" class="input-1 i1" placeholder="Your Name"/>
                    <input type="email" class="input-1 i2" placeholder="Your Email"/>
                    <input type="text" class="input-1 i3" placeholder="Your Number"/>
                    <textarea class="text-input i4"></textarea>
                    <button class="join-btn">Send Mail</button>
                </div>    
                </div>

            </div>

        </section>

        <section id="welcome-footer">
            <div class="welcome-section-box">
            <div class="welcome-footer-grid">

                <div>
                    <h3 className="headings">Quick Links</h3>

                    <ScrollLink to='hero' smooth={true} duration={300} class="welcome-footer-items f1">Home</ScrollLink>
                    <ScrollLink to='about' smooth={true} duration={300} class="welcome-footer-items f2">About us</ScrollLink>
                    <ScrollLink to='contact-us' smooth={true} duration={300} class="welcome-footer-items f3">Contact us</ScrollLink>

                </div>

                <div>
                    <h3 className="headings">Contacts</h3>
                    
                    <a class="welcome-footer-items f1">073 989 (9453)</a>
                    <a class="welcome-footer-items f2">082 123 (9453)</a>
                    <a class="welcome-footer-items f3">exersdev@gmail.com</a>
                    <a class="welcome-footer-items f4">1234 TUT Drive</a>
                </div>

                <div>
                    <h3 className="headings">Socials</h3>
                    
                    <a class="welcome-footer-items f1">Facebook</a>
                    <a class="welcome-footer-items f2">YouTube</a>
                    <a class="welcome-footer-items f3">Instagram</a>
                    <a class="welcome-footer-items f4">LinkedIn</a>
                    <a class="welcome-footer-items f5">Twitter</a>
                </div>

                <p class="copyrights">
                    icep emalahleni | all rights reserved
                </p>
                </div>
            </div>
        </section>

        </div>
        </>
    )
}

export default Welcome;