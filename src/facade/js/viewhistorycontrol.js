/**
 * @module M/control/ViewHistoryControl
 */

import ViewHistoryImplControl from 'impl/viewhistorycontrol';
import template from 'templates/viewhistory';
import { getValue } from './i18n/language';

export default class ViewHistoryControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(ViewHistoryImplControl)) {
      M.exception('La implementación usada no puede crear controles ViewHistoryControl');
    }
    // 2. implementation of this control
    const impl = new ViewHistoryImplControl();
    super(impl, 'ViewHistory');

    this.facadeMap_ = null;

    this.completed_ = false;

    this.load_ = false;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    this.addOnLoadEvents();
    return new Promise((success, fail) => {
      const options = {
        jsonp: true,
        vars: {
          translations: {
            nextView: getValue('nextView'),
            previousView: getValue('previousView'),
          },
        },
      };

      const html = M.template.compileSync(template, options);
      html.querySelector('#m-historyprevious-button').addEventListener('click', this.previousStep_.bind(this));
      html.querySelector('#m-historynext-button').addEventListener('click', this.nextStep_.bind(this));
      success(html);
    });
  }

  /**
   * Adds event listeners to control and map
   * @public
   * @function
   * @api
   */
  addOnLoadEvents() {
    this.on(M.evt.ADDED_TO_MAP, () => {
      this.load_ = true;
      if (this.completed_ && this.load_) {
        this.registerViewEvents_();
      }
    });
    this.facadeMap_.on(M.evt.COMPLETED, () => {
      this.completed_ = true;
      if (this.completed_ && this.load_) {
        this.registerViewEvents_();
      }
    });
  }

  /**
   * This function registers view events on map
   *
   * @function
   * @private
   */
  registerViewEvents_() {
    this.getImpl().registerViewEvents();
  }

  /**
   * This function shows the next zoom change to the map
   *
   * @private
   * @function
   * @param {Event} evt - Event
   */
  nextStep_(evt) {
    evt.preventDefault();
    this.getImpl().nextStep();
  }

  /**
   * This function shows the previous zoom change to the map
   *
   * @private
   * @function
   * @param {Event} evt - Event
   */
  previousStep_(evt) {
    evt.preventDefault();
    this.getImpl().previousStep();
  }

  // /**
  //  * This function is called on the control activation
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // activate() {
  //   super.activate();
  //   this.getImpl().activateClick(this.map_);
  // }
  // /**
  //  * This function is called on the control deactivation
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // deactivate() {
  //   super.deactivate();
  //   this.getImpl().deactivateClick(this.map_);
  // }
  // /**
  //  * This function gets activation button
  //  *
  //  * @public
  //  * @function
  //  * @param {HTML} html of control
  //  * @api stable
  //  */
  // getActivationButton(html) {
  //   return html.querySelector('.m-viewhistory button');
  // }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof ViewHistoryControl;
  }
}
