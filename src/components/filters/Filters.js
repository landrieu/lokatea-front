import React, { Component } from 'react'
import './filters.css';

export default class Header extends Component {
    state = {
        addtionnalFiltersDisplayed: false
    }

    componentDidMount(){
        // var filters = document.getElementById("more-filters");

        /*filters.addEventListener("click", function(evt){
            console.log("a");
            var filtersParams = document.getElementById("filters-parameters");
            filtersParams.classList.toggle("is-visible");
        });*/

    }

    toggleMoreFilters(){
        console.log("b");
        let addtionnalFilters = document.getElementsByClassName("addtionnal-filters");
        for(let el of addtionnalFilters){
            el.classList.toggle("is-visible");
        }

        this.setState({addtionnalFiltersDisplayed: !this.addtionnalFiltersDisplayed});
    }

    render() {
        return (
            //<!-- As a link -->
            <div id="form-container">
            <form>
                <div>
                    <div id="first-filters">
                        <div>
                            <span>Location:</span>
                            <input type="text" name="location" defaultValue="Paris" />
                        </div>
                        <div>
                            <span>Max price:</span>
                            <input type="number" name="max-price" defaultValue="0" />
                        </div>
                    </div>
                    <div id="second-filters" className="addtionnal-filters">
                        <div id="filters-parameters">
                            <div>
                                <span>Type:</span>
                            </div>
                            <div>
                                <span>Space:</span>
                            </div>
                        </div>
                    </div>
                    <div id="third-filters" className="addtionnal-filters">
                        <div id="filter-type">
                            <div>A</div>
                            <div>B</div>
                            <div>C</div>
                        </div>
                    </div>
                </div>
                <div id="more-filters" onClick={this.toggleMoreFilters.bind(this)}>
                    <span>+ More Filters</span>
                </div>
                <input type="submit" value="Submit" id="filter-submit-button"></input>
            </form>
            </div>
        )
    }
}
