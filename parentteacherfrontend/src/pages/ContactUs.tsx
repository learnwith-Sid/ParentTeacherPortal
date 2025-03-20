import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/creative/css/styles.css";

const Contact: React.FC = () => {
  return (
    <section className="page-section" id="contact">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center">
            <h2 className=" mt-0 text-white">Let's Get In Touch!</h2>
            <p className="text-muted mb-5 text-white">
              Start Better Communication !!
            </p>
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
          <div className="col-lg-6">
            <form id="contactForm">
              <div className="row align-items-stretch mb-5">
                <div className="form-floating mb-3">
                  <div className="form-group">
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      placeholder="Your Name *"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      placeholder="Your Email *"
                      required
                    />
                  </div>
                  <div className="form-group mb-md-0">
                    <input
                      className="form-control"
                      id="phone"
                      type="tel"
                      placeholder="Your Phone *"
                      required
                    />
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <div className="form-group form-group-textarea mb-md-0">
                    <textarea
                      className="form-control"
                      id="message"
                      placeholder="Your Message *"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary btn-xl text-uppercase"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
