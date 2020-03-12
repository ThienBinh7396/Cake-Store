import React from "react";
import { PropTypes } from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { CLIENT_NAV } from "./../../../constant/index";
import CarouselHeader from "./CarouselHeader";


class BannerHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.now = btoa(`${new Date().getTime()}`);
  }

  state = {
    background: "/img/bg-slide-1.jpg",
    color: null,
    type: null,
    nav: []
  };

  componentDidMount() {
    this.setState({
      background: this.props.background || "/img/bg-slide-1.jpg",
      color: this.props.color || null,
      type: this.props.type || null,
      nav: this.getNav()
    });
  }

  getNav() {
    let _match = this.props.match.url.split("/").filter(it => it);
    console.log(_match);

    let nav = _match.reduce((arr, current, index) => {
      let _find = CLIENT_NAV.find(it => it.route === current);

      if (index === 0 && current !== "home") {
        arr.push({ text: "Home", to: "/home", disable: false });
      }

      if (_find && index !== _match.length - 1) {
        return [...arr, { text: _find.text, to: _find.path, disable: false }];
      } else {
        return [...arr, { text: current, to: current, disable: true }];
      }
    }, []);

    console.log(nav);
    return nav;
  }

  render() {
    return (
      <div className="banner-header">
        <div
          className="banner-header-image"
          style={{
            backgroundImage: `url(${this.state.background})`
          }}
        ></div>
        <div
          className="banner-header-content"
          style={{ backgroundColor: this.state.color }}
        >
          {this.state.type === "title-with-nav" && (
            <>
              <div className="banner-header-title">{this.props.title}</div>
              <div className="banner-header-nav">
                {this.state.nav.map((it, index) => (
                  <span key={`#banner-header-${it.text}`}>
                    {it.disable ? (
                      <span>{`${it.text}${
                        index < this.state.nav.length - 1 ? " / " : ""
                      }`}</span>
                    ) : (
                      <Link to={it.to}>{`${it.text}${
                        index < this.state.nav.length - 1 ? " / " : ""
                      }`}</Link>
                    )}
                  </span>
                ))}
              </div>
            </>
          )}
          {this.state.type === "title-with-custom-nav" && (
            <>
              <div className="banner-header-title">{this.props.title}</div>
              {
                <div className="banner-header-nav">
                  {this.props.nav &&
                    this.props.nav.map((it, index) => (
                      <span
                        key={`#banner-header-${it.text}`}
                        className={it.className}
                      >
                        {it.disable ? (
                          <span>{`${index > 0 ? " / " : ""}${it.text}`}</span>
                        ) : (
                          <Link to={it.to}>{`${index > 0 ? " / " : ""}${
                            it.text
                          }`}</Link>
                        )}
                      </span>
                    ))}
                </div>
              }
            </>
          )}
          {this.state.type === "only-title" && (
            <>
              <div className="banner-header-title">{this.props.title}</div>
            </>
          )}
          {this.state.type === "carousel" && <CarouselHeader />}
        </div>
      </div>
    );
  }
}

BannerHeader.propTypes = {
  type: PropTypes.string.isRequired
};

export default withRouter(BannerHeader);
