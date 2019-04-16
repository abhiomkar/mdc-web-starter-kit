import './index.scss';
import $ from 'cash-dom';
import {MDCRipple} from '../../material-components-web/packages/mdc-ripple';
import {MDCMenu} from '../../material-components-web/packages/mdc-menu';
import {MDCTextField} from '../../material-components-web/packages/mdc-textfield';
import {MDCSelect} from '../../material-components-web/packages/mdc-select';

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
