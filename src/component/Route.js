/**
 * 路由的承担组件。每个Router都对应一个url。router组件可以嵌套
 */

import React, {Component, PropTypes} from 'react';

class Route extends Component{
	static defaultProps = {
		path: "",
		component: null,
	}

	static propTypes = {
		path: PropTypes.string.isRequired,
		component: PropTypes.any.isRequired,
	}

	constructor(props){
	    super(props);
		this.pageMap = {};
	}

	render(){
	    return null;
	}

}

export default Route;
