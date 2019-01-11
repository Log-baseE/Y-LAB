import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    roiPolygon: {
        fill: 'rgba(255,255,255,.25)',
        stroke: '#ffff00',
        strokeWidth: 2,
    },
    countingLine: {
        stroke: '#00ff00',
        strokeWidth: 2,   
    },
    laneLine: {
        stroke: '#ff0000',
        strokeWidth: 2
    }
});

class ROIOverlay extends Component {
    constructor(props) {
        super(props)
        const { roi, lanes, vertical } = props;
        this.state = {
            countline: this.calculateCountingLine(roi, vertical),
            lanes: this.calculateLanes(roi, lanes, vertical)
        }
    }
    componentDidUpdate = (prevProps) => {
        if(this.props.roi !== prevProps.roi || this.props.vertical !== prevProps.vertical) {
            const { roi, vertical } = this.props;
            this.setState({
                countline: this.calculateCountingLine(roi, vertical)
            })
        }
        if(this.props.roi !== prevProps.roi || this.props.lanes !== prevProps.lanes || this.props.vertical !== prevProps.vertical) {
            const { roi, lanes, vertical } = this.props;
            this.setState({ 
                lanes:  this.calculateLanes(roi, lanes, vertical)
            });
        }
    }
    calculateCountingLine = (roi, vertical) => {
        let topleft = vertical ? roi.topLeft : roi.topRight;
        let topright = vertical ? roi.topRight : roi.bottomRight;
        let bottomright = vertical ? roi.bottomRight : roi.bottomLeft;
        let bottomleft = vertical ? roi.bottomLeft : roi.topLeft;
        return {
            x1: (topleft.x + bottomleft.x)/2,
            y1: (topleft.y + bottomleft.y)/2,
            x2: (topright.x + bottomright.x)/2,
            y2: (topright.y + bottomright.y)/2
        }
    }
    calculateLanes = (roi, lanes, vertical) => {
        let laneCount = lanes.count;
        let shoulder = lanes.shoulderSize;
        let scale = lanes.perspectiveScaling;
        let geomSum = laneCount;
        if(scale !== 1)
            geomSum = (scale**laneCount - 1)/(scale - 1);
        
        let topleft = vertical ? roi.topLeft : roi.topRight;
        let topright = vertical ? roi.topRight : roi.bottomRight;
        let bottomright = vertical ? roi.bottomRight : roi.bottomLeft;
        let bottomleft = vertical ? roi.bottomLeft : roi.topLeft;

        let topWidth = { x: topright.x - topleft.x, y: topright.y - topleft.y };
        let topBase = { x: (1-Math.abs(shoulder))*topWidth.x/geomSum, y: (1-Math.abs(shoulder))*topWidth.y/geomSum };
        let topLanes = [topleft]

        if(shoulder > 0) {
            topLanes.push({
                x: topLanes.slice(-1)[0].x + shoulder*topWidth.x,
                y: topLanes.slice(-1)[0].y + shoulder*topWidth.y
            })
        }
        for(let i = 0; i < laneCount; ++i) {
            topLanes.push({
                x: topLanes.slice(-1)[0].x + topBase.x*scale**i,
                y: topLanes.slice(-1)[0].y + topBase.y*scale**i
            })
        }
        if(shoulder < 0) {
            topLanes.push({
                x: topLanes.slice(-1)[0].x + shoulder*topWidth.x,
                y: topLanes.slice(-1)[0].y + shoulder*topWidth.y
            })
        }

        let bottomWidth = { x: bottomright.x - bottomleft.x, y: bottomright.y - bottomleft.y };
        let bottomBase = { x: (1-Math.abs(shoulder))*bottomWidth.x/geomSum, y: (1-Math.abs(shoulder))*bottomWidth.y/geomSum };
        let bottomLanes = [bottomleft]

        if(shoulder > 0) {
            bottomLanes.push({
                x: bottomLanes.slice(-1)[0].x + shoulder*bottomWidth.x,
                y: bottomLanes.slice(-1)[0].y + shoulder*bottomWidth.y
            })
        }
        for(let i = 0; i < laneCount; ++i) {
            bottomLanes.push({
                x: bottomLanes.slice(-1)[0].x + bottomBase.x*scale**i,
                y: bottomLanes.slice(-1)[0].y + bottomBase.y*scale**i
            })
        }
        if(shoulder < 0) {
            bottomLanes.push({
                x: bottomLanes.slice(-1)[0].x - shoulder*bottomWidth.x,
                y: bottomLanes.slice(-1)[0].y - shoulder*bottomWidth.y
            })
        }

        lanes = [];
        for(let i = 1; i<topLanes.length - 1; ++i) {
            lanes.push({
                x1: topLanes[i].x,
                y1: topLanes[i].y,
                x2: bottomLanes[i].x,
                y2: bottomLanes[i].y,
            })
        }
        return lanes;
    }
    renderLanes = () => {
        console.log('render lanes');
        const { classes } = this.props;
        let lanes = this.state.lanes.map((lane, idx) => 
            <line {...lane} key={idx} className={classes.laneLine} />
        );
        console.log(lanes);
        return lanes;
    }
    render() {
        const { classes, viewBox, roi, traffic, drawLanes, lanes, ...other } = this.props;
        return (
            <div className={classes.root} {...other}>
                <svg width="100%" viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}>
                    { traffic && drawLanes ? this.renderLanes() : '' }
                    { traffic ? <line {...this.state.countline} className={classes.countingLine} /> : ''}
                    <polygon
                        points={`${roi.topLeft.x},${roi.topLeft.y} ${roi.topRight.x},${roi.topRight.y} ${roi.bottomRight.x},${roi.bottomRight.y} ${roi.bottomLeft.x},${roi.bottomLeft.y}`} 
                        className={classes.roiPolygon}
                    />
                </svg>
            </div>
        );
    }
}

ROIOverlay.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ROIOverlay);