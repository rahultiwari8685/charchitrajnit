import React, { Component } from "react";
import BannerSection from "../../../component/BannerSection";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";

import scrollIcon from "../../../assets/img/icon/scroll.png";
import black_phone from "../../../assets/img/icon/black_phone.png";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
  }

  state = {
    name: "",
    subject: "",
    email: "",
    phone: "",
    message: "",
  };
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  submitHandler = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      toast.success("You submitted the form and stuff!");
      this.setState({
        name: "",
        subject: "",
        email: "",
        phone: "",
        message: "",
      });
      this.validator.hideMessages();
    } else {
      toast.error("Please fill the input");
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };

  render() {
    const { name, subject, email, phone, message } = this.state;
    return (
      <>
        {/* <div className="inner inner_bg inner_overlay">
          <div className="container">
            <div className="inner_wrap">
              <div className="row">
                <div className="col-lg-6">
                  <div className="title_inner">
                    <h6>CONTACT US</h6>
                    <h1>let's Contact</h1>
                  </div>
                </div>
              </div>
              <div className="inner_scroll">
                <div className="scrollIcon">
                  <img src={scrollIcon} alt="scrollIcon" />
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="contacts section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                {/* <div className="box single_contact_box">
                  <div className="contact_title">
                    <h3>Headquarters</h3>
                  </div>
                  <div className="contact_details">
                    <div className="contact_details_icon">
                      <FontAwesome name="map-marker-alt" />
                    </div>
                    <p>LOCATION:</p>
                    <h6>
                      Shop No. 8, Rail Nagar, Sector J, Ashiyana,
                      Lucknow(UP)-226012
                    </h6>
                  </div>
                </div> */}
              </div>
              <div className="col-lg-4">
                <div className="box single_contact_box">
                  <div className="contact_title">
                    <h3>Headquarters</h3>
                  </div>
                  <div className="contact_details">
                    <div className="contact_details_icon">
                      <img src={black_phone} alt="black_phone" />
                    </div>
                    <p>LOCATION:</p>
                    <h6>
                      08, LDA Marketing Complex, Rail Nagar, Sector-J, Ashiyana, Lucknow–226012, Uttar Pradesh
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                {/* <div className="box single_contact_box">
                  <div className="contact_title">
                    <h3>Headquarters</h3>
                  </div>
                  <div className="contact_details">
                    <div className="contact_details_icon">
                      <FontAwesome name="envelope" />
                    </div>
                    <p>LOCATION:</p>
                    <h6>
                      Shop No. 8, Rail Nagar, Sector J, Ashiyana,
                      Lucknow(UP)-226012
                    </h6>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/*contact form area*/}
        <div className="contact_form padding-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div
                  className="map"
                  style={{ width: "100%", overflow: "hidden" }}
                >
                  <iframe
                    title="Bharat 19 Express Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d7122.551661420581!2d80.91643676642067!3d26.799344524631543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDQ3JzU1LjciTiA4MMKwNTUnMTguMSJF!5e0!3m2!1sen!2sin!4v1791558691962!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{
                      border: 0,
                      display: "block",
                      width: "100%",
                      maxWidth: "100%",
                      borderRadius: "8px",
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
            <div className="space-50" />
            <div className="row">
              <div className="col-lg-8">
                <div className="cotact_form">
                  <div className="row">
                    <div className="col-12">
                      <h3>
                        Let’s work together! <br /> Fill out the form.
                      </h3>
                    </div>
                    <div className="col-12">
                      <form onSubmit={this.submitHandler}>
                        <div className="row">
                          <div className="col-lg-6">
                            <input
                              name="name"
                              value={name}
                              onChange={this.changeHandler}
                              type="text"
                              placeholder="Full Name"
                            />
                            {this.validator.message(
                              "Full Name",
                              name,
                              "required",
                            )}
                          </div>
                          <div className="col-lg-6">
                            <input
                              name="subject"
                              value={subject}
                              onChange={this.changeHandler}
                              type="text"
                              placeholder="Subject"
                            />
                            {this.validator.message(
                              "Subject",
                              subject,
                              "required",
                            )}
                          </div>
                          <div className="col-lg-6">
                            <input
                              name="email"
                              value={email}
                              onChange={this.changeHandler}
                              type="email"
                              placeholder="Email Adress"
                            />
                            {this.validator.message(
                              "Email",
                              email,
                              "required|email",
                            )}
                          </div>
                          <div className="col-lg-6">
                            <input
                              name="phone"
                              value={phone}
                              onChange={this.changeHandler}
                              type="number"
                              placeholder="Phone Number"
                            />
                            {this.validator.message("Phone", phone, "required")}
                          </div>
                          <div className="col-12">
                            <textarea
                              name="message"
                              value={message}
                              onChange={this.changeHandler}
                              id="message"
                              cols="30"
                              rows="5"
                              placeholder="Tell us about your message…"
                            />
                            {this.validator.message(
                              "Message",
                              message,
                              "required",
                            )}
                          </div>
                          <div className="col-12">
                            <div className="space-20" />
                            <button className="cbtn1" type="submit">
                              Sent Messege
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <FollowUs title="Follow Us" />
                <NewsLetter />
              </div>
            </div>
          </div>
        </div>
        <BannerSection />
      </>
    );
  }
}

export default Contact;
