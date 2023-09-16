// Import necessary dependencies and components
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Modal from 'react-modal';
import logo from './images/aiswarya offset.png';
import main from './images/istockphoto-1221270204-612x612.jpg';
import slideshow1 from './images/screen.jpeg';
import slideshow2 from './images/img2.jpg';
import slideshow3 from './images/img3.jpg';
import { throttle } from 'lodash';

import QuoteModal from './components/QuoteModal.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
// Set the root element for the Modal component
Modal.setAppElement('#root');

// Define the main component function
function App() {
  // Define and initialize state variables
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Define an array of slide data
  const slides = [
    { src: slideshow1, text: 'Offset printing', overlayText: 'Screen Printing' },
    { src: slideshow2, text: 'Caption Two', overlayText: 'Offset Printing' },
    { src: slideshow3, text: 'Caption Three', overlayText: 'Notice Printing' },
  ];

  // Create references for DOM elements
  const fadeElementsRef = useRef(null);
  const slidesRef = useRef(null);
  const dotsRef = useRef(null);

  // Function to change slides
  const plusSlides = useCallback((n) => {
    const newIndex = (slideIndex + n + slides.length) % slides.length;
    setSlideIndex(newIndex);
  }, [slideIndex, slides.length]);

  // useEffect hook to handle various side effects
  useEffect(() => {
    // Get DOM elements and set scroll event handler
    fadeElementsRef.current = document.querySelectorAll('.fade-in-element');
    slidesRef.current = document.getElementsByClassName('mySlides');
    dotsRef.current = document.getElementsByClassName('dot');

    const throttledScrollHandler = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledScrollHandler);

    // Set up interval for automatic slide change
    let animationFrameId;
    const slideshowInterval = setInterval(() => {
      animationFrameId = requestAnimationFrame(() => {
        const newIndex = (slideIndex + 1 + slides.length) % slides.length;
        if (slideIndex !== newIndex) {
          setSlideIndex(newIndex);
        }
      });
    }, 6000);

    // Show initial slide
    showSlides(slideIndex + 1);

    // Clean up event listeners and interval on component unmount
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearInterval(slideshowInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [slideIndex]);

  // Function to handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Create a JSON object with the form data
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };
    setName(formData.name);

    // Show the alert
    setShowAlert(true);

    // Reset the form
    e.target.reset();
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    try {
      // Send a POST request with the form data to the server
      const response = await fetch('http://127.0.0.1:8000/contact_us/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully');
        // Optionally, you can reset the form fields here
        e.target.reset();
      } else {
        alert('Error sending message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  // Function to handle scroll events
  const handleScroll = () => {
    // Determine which tab is active based on scroll position
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach((tabPane, index) => {
      const rect = tabPane.getBoundingClientRect();
      const offset = window.innerHeight * 0.4; // Adjust this percentage as needed

      if (rect.top <= offset && rect.bottom >= offset) {
        setActiveTab(tabPane.id);
      }
    });

    // Handle fading elements on scroll
    const fadeElements = fadeElementsRef.current;

    fadeElements.forEach(element => {
      const distanceToTop = element.getBoundingClientRect().top;
      const isVisible = distanceToTop <= window.innerHeight;

      if (isVisible) {
        element.classList.add('fade-in');
      } else {
        element.classList.remove('fade-in');
      }
    });
  };

  // Function to set the current slide
  const currentSlide = (n) => {
    // Set slide index directly
    setSlideIndex(n - 1);
  };

  // Function to show slides
  const showSlides = useCallback(() => {
    const slides = slidesRef.current;
    const dots = dotsRef.current;

    for (let i = 0; i < slides.length; i++) {
      if (i === slideIndex) {
        slides[i].style.display = 'block';
        slides[i].style.opacity = 1;
        dots[i].classList.add('active');
      } else {
        slides[i].style.display = 'none';
        slides[i].style.opacity = 0;
        dots[i].classList.remove('active');
      }
    }
  }, [slideIndex]);

  // JSX for the component
  return (
    <div className="App">
      {/* Logo and Navbar */}
      <div className='sticky-contents'>
        <div className='navbar-container fade-in'>
          <div className="logo-container">
            <img src={logo} alt="Aiswarya Offset Printers" className="logo" />
            <div className="logo-line fade-in"></div> {/* Add this line */}
          </div>
          {/* Contact information */}
          <div className="header">
            <div className="contact-info">
              <p id='contact'>Call Us: 9447256381, 9447163058 | Mail Us: aiswaryaprinters.tvla@gmail.com</p>
            </div>
          </div>
          {/* Navbar */}
          <nav className="navbar fade-in">
            <a
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              href="#home"
              onClick={() => handleTabChange('home')}>
              Home
            </a>
            <a
              className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
              href="#services"
              onClick={() => handleTabChange('services')}>
              Services
            </a>
            <a
              className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
              href="#about"
              onClick={() => handleTabChange('about')}>
              About
            </a>
            <a className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
              href="#contact"
              onClick={() => handleTabChange('contact')}>
              Contact
            </a>
          </nav>
          <div className='socialmedia fade-in'>
            <a href="https://instagram.com/aiswaryaoffsetprinters?igshid=NjIwNzIyMDk2Mg==" target="_blank" rel="noopener noreferrer" className='instagram'>
    <FontAwesomeIcon icon={faInstagram} className="icon" />
  </a>&nbsp;
  <a href="https://www.facebook.com/chandrakumar.pc.5?mibextid=9R9pXO" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faFacebook} className="icon" />
  </a></div>
          <div className="navbar-line fade-in"></div> {/* Add this line */}
        </div>
      </div>
      {/* Home Section */}
      <div className='maincontent'>
      {showAlert && (
        <div className="custom-alert">
  <p>Hello, {name}!</p>
          <p>We've received your message and will get back to you soon.</p>
          
        </div>
      )}
        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === 'home' ? 'active' : ''} fade-in-up`} id="home">
            <section id="welcome" className="section welcome-section fade-in">
              <div className="welcome-content">
                <div className="welcome-text">
                  <p className='introwel'><span className="welcome-title">Welcome to</span><br /> <span className="printers-title">Aiswarya Offset Printers</span></p>
                  <p>We bring your ideas to life with precision and creativity.<br></br> Explore our services and let's create something extraordinary together.</p>
                </div>
                <div className="welcome-actions">
                  <button className="quote-button" onClick={openModal}>
                    Get Quote
                  </button>
                  <QuoteModal isOpen={isModalOpen} onRequestClose={closeModal} />
                  <div className="welcome-image">
                    <img src={main} alt="Welcome" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={`tab-pane fade ${activeTab === 'services' ? 'active' : ''} fade-in-up`} id="services">
          <section id="slideshow" className="slideshow-section fade-in-element">
            <div className='section-slide'>
              <div className="slideshow-container">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`mySlides fade ${index === slideIndex ? 'active' : ''}`}
                    style={{ display: index === slideIndex ? 'block' : 'none', opacity: index === slideIndex ? 1 : 0 }}
                  >
                    <img src={slide.src} style={{ width: '100%' }} alt={`Slide ${index}`} />
                  
                    <div className="overlay-text">{slide.overlayText}</div>
                  </div>
                ))}
                <button className="prev" onClick={() => plusSlides(-1)}>
                  ❮
                </button>
                <button className="next" onClick={() => plusSlides(1)}>
                  ❯
                </button>
              </div>
              <br />
              <div style={{ textAlign: 'center' }}>
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === slideIndex ? 'active' : ''}`}
                    onClick={() => currentSlide(index + 1)}
                    role="button"
                  ></span>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className={`tab-pane fade ${activeTab === 'about' ? 'active' : ''} fade-in-up`} id="about">
  <section id="aboutsection" className="section welcome-section fade-in">
    <div className="about-content">
      <h2>About Us</h2>
      <p>
        Welcome to Aiswarya Offset Printers, a family-owned printing press established in 2002 and located in Thiruvalla. With a passion for printing and a commitment to quality, we have been proudly serving our valued customers for over two decades.
      </p>
      <p>
        Our journey began with a vision to provide exceptional printing solutions to our community. What started as a small endeavor has grown into a trusted printing press known for its attention to detail and personalized service.
      </p>
      <p>
        As a family team, we take pride in every project we undertake. From offset printing to screen printing, we handle each job with care, ensuring that the final product meets and exceeds your expectations.
      </p>
      <p>
        We thank you for choosing Aiswarya Offset Printers and being a part of our story. Your support drives us to continuously improve and deliver excellence in every print.
      </p>
    </div>          
  </section>
</div>

<div className={`tab-pane fade ${activeTab === 'contact' ? 'active' : ''} fade-in-up`} id="contact">
        <section id="contact" className="section welcome-section fade-in">
          <div className="contact-content">
            <h2>Contact Us</h2>
            <p>
              If you have any questions, inquiries, or would like to request a quote, feel free to get in touch with us. We're here to assist you in any way we can.
            </p>

            <div className="contact-form">
              <h3>Send us a message</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit">Send</button>
              </form>
               {/* Render the custom alert */}
      
            </div>
          </div>
        </section>
      </div>

      </div>

     
      {/* Slideshow Section */}      
    </div>
      
    </div>
  );
}

export default App;
