/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */
import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import Mousetrap from "mousetrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import {
  NarrativeStyles,
  linkStyles,
  OpacityFade,
  EndOfNarrative,
  ProgressBar,
  ProgressButton
} from './styles';
import ReactPageScroller from "./ReactPageScroller";
import { changePage, EXPERIMENTAL_showMainDisplayMarkdown } from "../../actions/navigation";
import { CHANGE_URL_QUERY_BUT_NOT_REDUX_STATE } from "../../actions/types";
import { narrativeNavBarHeight } from "../../util/globals";

/* regarding refs: https://reactjs.org/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components */
const progressHeight = 25;

const explanationParagraph=`
  <p class="explanation">
  Explore the narrative by scrolling on the left panel, or click "explore the data yourself" in the top right to interact with the data.
  </p>
`;

/**
 * A react component which renders the narrative text content in the sidebar.
 * Controls the interactions which trigger page changes of the narrative.
 */
@connect((state) => ({
  loaded: state.narrative.loaded,
  blocks: state.narrative.blocks,
  currentInFocusBlockIdx: state.narrative.blockIdx
}))
class Narrative extends React.Component {
  constructor(props) {
    super(props);
    this.exitNarrativeMode = () => {
      this.props.dispatch(changePage({ path: this.props.blocks[0].dataset, query: true }));
    };
    this.changeAppStateViaBlock = (reactPageScrollerIdx) => {
      const idx = reactPageScrollerIdx-1; // now same coords as `blockIdx`

      if (this.props.blocks[idx].mainDisplayMarkdown) {
        this.props.dispatch(EXPERIMENTAL_showMainDisplayMarkdown({
          query: queryString.parse(this.props.blocks[idx].query),
          queryToDisplay: {n: idx}
        }));
        return;
      }

      this.props.dispatch(changePage({
        // path: this.props.blocks[blockIdx].dataset, // not yet implemented properly
        changeDataset: false,
        query: queryString.parse(this.props.blocks[idx].query),
        queryToDisplay: {n: idx},
        push: true
      }));

    };
    this.goToNextSlide = () => {
      if (this.props.currentInFocusBlockIdx === this.props.blocks.length-1) return; // no-op
      this.reactPageScroller.goToPage(this.props.currentInFocusBlockIdx+1);
    };
    this.goToPreviousSlide = () => {
      if (this.props.currentInFocusBlockIdx === 0) return; // no-op
      this.reactPageScroller.goToPage(this.props.currentInFocusBlockIdx-1);
    };
  }
  componentDidMount() {
    if (window.twttr && window.twttr.ready) {
      window.twttr.widgets.load();
    }
    /* if the query has defined a block to be shown (that's not the first)
    then we must scroll to that block */
    if (this.props.currentInFocusBlockIdx !== 0) {
      this.reactPageScroller.goToPage(this.props.currentInFocusBlockIdx);
    }
    /* bind arrow keys to move around in narrative */
    /* Note that "normal" page scrolling is not avaialble in narrative mode
    and that scrolling the sidebar is associated with changing the narrative slide */
    Mousetrap.bind(['left', 'up'], this.goToPreviousSlide);
    Mousetrap.bind(['right', 'down'], this.goToNextSlide);
  }
  renderChevron(pointUp) {
    const width = 30;
    const style = {
      zIndex: 200,
      position: "absolute",
      cursor: "pointer",
      left: `${this.props.width/2 - width/2}px`,
      fontSize: `${width}px`,
      height: `${width}px`
    };
    if (pointUp) style.top = narrativeNavBarHeight + progressHeight;
    if (!pointUp) style.bottom = "5px";
    else style.bottom = 0;
    const icon = pointUp ? <FaChevronUp /> : <FaChevronDown />;
    return (
      <div id={`hand${pointUp?"Up":"Down"}`}
        style={style}
        onClick={pointUp ? this.goToPreviousSlide : this.goToNextSlide}
      >
        {icon}
      </div>
    );
  }
  renderProgress() {
    return (
      <ProgressBar style={{height: `${progressHeight}px`}}
        role="navigation"
      >
        {this.props.blocks.map((b, i) => {
          const d = this.props.currentInFocusBlockIdx === i ?
            "14px" : "6px";
          return (<ProgressButton
            key={i}
            style={{width: d, height: d}}
            onClick={() => this.reactPageScroller.goToPage(i)}
          />);
        })}
      </ProgressBar>
    );
  }
  renderBlocks() {
    return this.props.blocks.map((b, i) => {

      if (b.isEndOfNarrativeSlide) {
        return (
          <EndOfNarrative key="EON" id="EndOfNarrative">
            <h1>END OF NARRATIVE</h1>
            <a style={{...linkStyles}}
              onClick={() => this.reactPageScroller.goToPage(0)}
            >
              Scroll back to the beginning
            </a>
            <br />
            <a style={{...linkStyles}}
              onClick={this.exitNarrativeMode}
            >
              Leave the narrative & explore the data yourself
            </a>
          </EndOfNarrative>
        );
      }

      const __html = i === 0 ?
        explanationParagraph + b.__html : // inject explanation to opening block
        b.__html;

      return (
        <div
          dir="auto"
          id={`NarrativeBlock_${i}`}
          key={i}
          style={{
            padding: "10px 20px",
            height: "inherit",
            overflowX: "hidden",
            overflowY: "auto"
          }}
          dangerouslySetInnerHTML={{__html}}
        />
      );
    });
  }
  render() {
    if (!this.props.loaded) {return null;}
    return (
      <NarrativeStyles
        id="NarrativeContainer"
        narrativeNavBarHeight={narrativeNavBarHeight}
      >
        {this.renderProgress()}
        <OpacityFade position="top" topHeight={narrativeNavBarHeight + progressHeight}/>
        <OpacityFade position="bottom"/>
        {this.props.currentInFocusBlockIdx !== 0 ? this.renderChevron(true) : null}
        {this.props.currentInFocusBlockIdx !== this.props.blocks.length-1 ? this.renderChevron(false) : null}
        <ReactPageScroller
          ref={(c) => {this.reactPageScroller = c;}}
          containerHeight={this.props.height-progressHeight}
          pageOnChange={this.changeAppStateViaBlock}
        >
          {this.renderBlocks()}
        </ReactPageScroller>
      </NarrativeStyles>
    );
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: CHANGE_URL_QUERY_BUT_NOT_REDUX_STATE,
      pathname: this.props.blocks[this.props.currentInFocusBlockIdx].dataset,
      query: queryString.parse(this.props.blocks[this.props.currentInFocusBlockIdx].url)
    });
    Mousetrap.unbind(['left', 'right', 'up', 'down']);
  }
}
export default Narrative;
