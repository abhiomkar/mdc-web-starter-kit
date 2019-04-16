import './index.scss';
import $ from 'cash-dom';
import {MDCMenu} from '@material/menu';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

$('.mdc-button').each((index, el) => {
  new MDCRipple(el);
});

$('.mdc-menu').each((index, el) => {
  new MDCMenu(el);
});

$('.mdc-text-field').each((index, el) => {
  new MDCTextField(el);
});

$('.mdc-select').each((index, el) => {
  new MDCSelect(el);
});
