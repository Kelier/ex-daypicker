import React, { Component } from 'react';

import './daypicker.css';

const defalutSTimes = Array.from(new Array(24), (val,index) => index);
const defalutETimes = Array.from(new Array(24), (val,index) => index+1);

class DayPicker extends Component {

    state = {
        defalutSTimes: defalutSTimes,
        defalutETimes: defalutETimes,
        popCss: 'ex-picker-pop',
        timeStore: {},
        showTime: '',
        startTimes: defalutSTimes,
        endTimes: defalutETimes
    }

    /**
     * @function picker blur
     * @param {any} el 
     * @returns 
     * @memberof DayPicker
     */
    wtf(el) {
        if (el.className === 'ex-day-picker-layout' || el.className === 'App') {
            return true;
        }
        if (el.className.indexOf('ex-picker-pop') > 0) {
            return false;
        } else {
            this.wtf(el.parentNode);
        }
    }

    /**
     * @function show popup
     * @memberof DayPicker
     */
    focusPicker() {
        this.setState({
            popCss : 'ex-picker-pop showup'
        });
    }

    /**
     * @function hide popup
     * @memberof DayPicker
     */
    blurPicker(e) {
        if (this.wtf(e.target, 'ex-day-picker-layout')) {
            this.setState({
                popCss : 'ex-picker-pop hidedown'
            });
            
            // 如果只选择一个就清空
            if (!(this.state.start && this.state.end)) {
                this.setState({
                    start: undefined,
                    end: undefined,
                    timeStore: {}
                });
            }
        }
    }

    /**
     * @function active the choose time
     * @param {any} store 
     * @memberof DayPicker
     */
    activeTime(store) {
        const {start, end} = store;
        this.setState({
            start: start,
            end: end
        });

        if (this.state.start && this.state.end) {
            this.setState({
                popCss : 'ex-picker-pop hidedown',
                showTime: start+':00-'+(end%24 === 0 ? 24 : (end%24))+':00'
            });
        }
    }

    /**
     * @function subscribe the time by index
     * @param {any} index 
     * @returns 
     * @memberof DayPicker
     */
    subTime(index) {
        if (!index) {
            return null;
        }
        // left list
        if (index < 24) {
            const times = [].concat(this.state.defalutETimes).map((i)=>{
                return i = i + ~~index;
            }).slice(0, 24-index);
            this.setState({
                timeStore: Object.assign(this.state.timeStore, {
                    start: index,
                }),
                endTimes: times
            });
        } else {
            // right list
            const times = [].concat(this.state.defalutSTimes).slice(0, index % 24 === 0 ? 24 : index % 24);
            
            this.setState({
                timeStore: Object.assign(this.state.timeStore, {
                    end: index
                }),
                startTimes: times
            });
        }
        this.activeTime(this.state.timeStore);
    }

    clearTime() {
        this.setState({
            showTime: '',
            startTimes: defalutSTimes,
            endTimes: defalutETimes,
            timeStore: {},
            start: undefined,
            end: undefined
        });
    }

    componentDidMount() {
        document.body.addEventListener('click',(e) => {
            this.blurPicker(e);
        });
        const flexPicker = document.querySelector('.ex-picker-flex');
        flexPicker.addEventListener('click', (e) => {
            let index = e.target.getAttribute('index');
            this.subTime(index);
        });
    }

    componentWillUnMount() {
        document.body.removeEventListener('click', (e) => {
            this.blurPicker(e);
        });
        const flexPicker = document.querySelector('.ex-picker-flex');
        flexPicker.removeEventListener('click', (e) => {
            this.subTime();
        });
    }

    render() {

        console.log(this.state.endTimes, 'render');

        const startList = this.state.startTimes.map((item, index) => {
            const timeList = index === parseInt(this.state.start) ?  <div className="ex-pop-li ex-pop-li-active" key={index}>
                <span index={index}>{item}:00</span>
            </div> :  <div className="ex-pop-li" key={index}>
                <span index={index}>{item}:00</span>
            </div>;
            return timeList;
        });

        const endList = this.state.endTimes.map((item, index) => {
            const timeList = item+24 === ~~(this.state.end) ?  <div className="ex-pop-li ex-pop-li-active" key={index}>
                <span index={item+24}>{item}:00</span>
            </div> :  <div className="ex-pop-li" key={index}>
                <span index={item+24}>{item}:00</span>
            </div>;
            return timeList;
        });

      return (
        <div className = "ex-day-picker-layout">
            <div className="ex-input-area">
                <input type="text"
                value={this.state.showTime}
                readOnly="readonly"
                onFocus = {() => {
                    this.focusPicker();
                }}
                className = "ex-day-picker"
                />
                <span className="ex-day-icon" role="img" aria-label="clock"
                onClick={()=>{
                    this.clearTime();
                }}
                >🕒</span>
            </div>
            
            <div className={this.state.popCss}>
                <div className="ex-picker-flex">
                    <div className="ex-pop-window">
                        <ul className="ex-pop-ul">
                            {
                                startList
                            }
                        </ul>
                    </div>
                    <div className="ex-pop-line">-</div>
                    <div className="ex-pop-window">
                        <ul className="ex-pop-ul">
                            {
                                endList
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}

export default DayPicker;