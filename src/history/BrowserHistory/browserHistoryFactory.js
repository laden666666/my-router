import createBrowserHistory from 'history/createBrowserHistory';
import BrowserUrl from './BrowserUrl';
import History from '../History';

//browser是个单例模式。故采用单例工厂模式
var browserHistory = new History(createBrowserHistory, BrowserUrl);
export default function () {
	return browserHistory;
}
