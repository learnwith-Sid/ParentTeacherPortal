import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <header className="masthead ">
        <div className="container px-4 px-lg-5 h-100">
          <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-end">
              <h1 className="text-white font-weight-bold">
                Welcome to Parent-Teacher Portal
              </h1>
            </div>
            <div className="col-lg-8 align-self-baseline">
              <p className="text-white-75 mb-5">
                Enhancing communication between parents and teachers for a
                better education experience.
              </p>
              <a className="btn btn-primary btn-xl" href="#about">
                Find Out More
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="page-section bg-light" id="features">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Key Features</h2>
          </div>
          <div className="row text-center">
            <div className="col-md-4">
              <img
                src="/assets/assignment.png"
                alt="Assignments"
                className="img-fluid mb-3"
              />
              <h3 className="h4 mb-3">Student Assignments</h3>
              <p className="text-muted">
                Teachers can upload assignments, and students can view and
                submit them.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src="/assets/attendance.png"
                alt="Attendance"
                className="img-fluid mb-3"
              />
              <h3 className="h4 mb-3">Attendance Tracking</h3>
              <p className="text-muted">
                Parents can monitor student attendance in real-time.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src="/assets/admin.png"
                alt="Admin Control"
                className="img-fluid mb-3"
              />
              <h3 className="h4 mb-3">Admin Control</h3>
              <p className="text-muted">
                The admin can manage users, assign roles, and monitor
                activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="page-section bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-4">What Our Users Say</h2>
          <p className="lead">
            "This platform has transformed how I communicate with teachers!" - A
            Happy Parent
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="page-section text-center">
        <div className="container">
          <h2 className="mb-4 text-white">
            Join the platform and streamline parent-teacher communication.
          </h2>
          <Link to="/contact-us" className="btn btn-primary btn-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
