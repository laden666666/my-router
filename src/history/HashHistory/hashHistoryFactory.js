import createHashHistory from 'history/createHashHistory';
import HashUrl from './HashUrl';
import History from '../History';

//hash是个单例模式。故采用单例工厂模式
var hashHistory = new History(createHashHistory, HashUrl);
export default function () {
    return hashHistory;
}
