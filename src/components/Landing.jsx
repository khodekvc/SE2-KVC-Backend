import "../css/Landing.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons'

function Landing() {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Chelsea+Market"
      />
      <section className="hero" id="home">
      <img src="/landingbg.png" width="800" height="500" />
        <div className="hero-content">
          <h1>
            KHO
            <br />
            VETERINARY
            <br />
            CLINIC
          </h1>
          <p>Four Paws, Two Feet, One Heart</p>
          <a href="/signup-petowner" className="button">
            SIGN UP
          </a>
        </div>
      </section>

      <div className="cat2">
        <img src="/cat2.png" alt="Cat2" />
      </div>

      <section className="about" id="about">
        <div className="about-text-images">
          <div className="about-text">
            <h2>ABOUT</h2>
          </div>
          <div className="about-images">
            <div className="about-images-cat-dog">
              <img src="/cat.png" alt="Cat" />
              <img src="/dog.png" alt="Dog" />
            </div>
            <div className="about-images-bird">
              <img src="/bird.png" alt="Bird" />
            </div>
          </div>
        </div>
        <div className="about-text">
          <p>
            Lorem ipsum dolor sit amet. Qui excepturi deleniti id eaque
            doloribus qui harum expedita. Et dolore cumque ut animi eaque et
            aperiam odio aut soluta repellendus et aperiam ipsum aut ipsum
            voluptatibus. Et commodi consequatur qui dolorum ducimus et omnis
            tempora. Id voluptatum fugit eos velit iure aut dolores nihil. Vel
            asperiores delectus et iure facere ut.
          </p>
        </div>
        <div className="dog2">
          <img src="/dog2.png" alt="Dog2" />
        </div>
        <div className="about-services">
          <h2>WE OFFER 24 HOURS<br />VET SERVICES</h2>
        </div>
      </section>

      <section className="contact" id="contact">
        <h2>CONTACT US</h2>
        <div className="map-place">
          <div className="google-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.8611940740166!2d120.990829974573!3d14.606981976921476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c93d5079b1dd%3A0xb6c4b4365ca4cb2d!2sKho%20Veterinary%20Clinic!5e0!3m2!1sen!2sph!4v1737052687426!5m2!1sen!2sph"
              width={640}
              height={400}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="clinicplace">
            <img src="/clinicplace.png" alt="Clinic Place" />
          </div>
        </div>
        <div className="details">
          <div className="detail-item">
          <FontAwesomeIcon icon={faLocationDot} className="icon"/>
            <p>
              <strong>Location:</strong>
            </p>
            <p>730 Earnshaw st, Cayco St, Sampaloc, Manila, 1008 Metro Manila</p>
          </div>
          <div className="detail-item">
          <FontAwesomeIcon icon={faPhone} className="icon"/>
            <p>
              <strong>Phone Number:</strong>
            </p>
            <p>0991 666 0540</p>
          </div>
          <div className="detail-item">
          <FontAwesomeIcon icon={faEnvelope} className="icon"/>
            <p>
              <strong>Email:</strong>
            </p>
            <p>khovetclinic@email.com</p>
          </div>
          <div className="detail-item">
          <FontAwesomeIcon icon={faClock} className="icon"/>
            <p>
              <strong>Working Hours:</strong>
            </p>
            <p>
              Monday to Sunday
              <br />
              8:00 AM to 8:00 PM
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Kho Veterinary Clinic. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
