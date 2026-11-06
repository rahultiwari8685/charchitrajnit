import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// images
import match1 from "../../assets/img/flag/flag-1.png";
import match2 from "../../assets/img/flag/flag-2.png";
import match3 from "../../assets/img/flag/flag-3.png";
import match4 from "../../assets/img/flag/flag-4.png";
import match5 from "../../assets/img/flag/flag-5.png";

const matches = [
  {
    image: match1,
    value: 30,
    countries: ["Germany", "France"],
    date: "Tomorrow",
    time: "M22:30 (CST)",
  },
  {
    image: match2,
    value: 30,
    countries: ["Germany", "France"],
    date: "Tomorrow",
    time: "M22:30 (CST)",
  },
  {
    image: match3,
    value: 30,
    countries: ["Germany", "France"],
    date: "Tomorrow",
    time: "M22:30 (CST)",
  },
  {
    image: match4,
    value: 30,
    countries: ["Germany", "France"],
    date: "Tomorrow",
    time: "M22:30 (CST)",
  },
  {
    image: match5,
    value: 30,
    countries: ["Germany", "France"],
    date: "Tomorrow",
    time: "M22:30 (CST)",
  },
];

const UpcomingMatches = ({ dark }) => {
  return (
    <div className="widget upcomming_macth mb30">
      <div className="row">
        <div className="col-8 align-self-center">
          <h2 className="widget-title">Upcoming Matches</h2>
        </div>
        <div className="col-4 text-right align-self-center">
          <Link to="#" className="see_all mb20">
            See All
          </Link>
        </div>
      </div>
      {matches.map((item, i) => (
        <div key={i}>
          <div className="single_post post_type13 widgets_small">
            <div className="post_img">
              <Link to="/">
                <img src={item.image} alt="icon" />
              </Link>
            </div>
            <div className="single_post_text">
              <h4>
                <Link to="/" className="playing_teams">
                  {item.countries.map((country, i) => (
                    <div key={i}>
                      {country}{" "}
                      {i + 1 < item.countries.length ? (
                        <span>VS &nbsp;</span>
                      ) : null}
                    </div>
                  ))}
                </Link>
              </h4>
              <p className="meta macth_meta">
                {item.date} &nbsp;|&nbsp;<span> {item.time} </span> &nbsp;
              </p>
            </div>
            <div
              className="circle_match_time"
              style={{ maxWidth: "45px", padding: "5px" }}
            >
              <CircularProgressbar
                value={34.4}
                maxValue={100}
                strokeWidth={12}
                className="CircularProgressbarSt"
                styles={buildStyles({
                  trailColor: "rgb(233, 234, 238)",
                  pathColor: "#FF5555",
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                  rotation: 0.5,
                })}
              />
              {/*<div className="first_circle circle"/>*/}
            </div>
          </div>
          <div className="space-10" />
          {dark ? (
            <div className="border_white" />
          ) : (
            <div className="border_black" />
          )}
          <div className="space-10" />
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatches;
UpcomingMatches.propTypes = {
  dark: ProtoTypes.bool,
};
