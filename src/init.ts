import '@/styles/fix.scss';
import '@/styles/global.scss';
import '@/styles/code-theme.scss';
// import 'highlight.js/styles/atom-one-dark.css';
import { loadIcon } from '@ysmj/web_utils';
import 'moment/locale/zh-cn';
import Moment from 'moment';

Moment.locale('zh-cn');
loadIcon(process.env.ICON_URL);
