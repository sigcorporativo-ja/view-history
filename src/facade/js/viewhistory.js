/**
 * @module M/plugin/ViewHistory
 */
import 'assets/css/viewhistory';
import ViewHistoryControl from './viewhistorycontrol';
import api from '../../api';

export default class ViewHistory extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(options = {}) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Position of the plugin on browser window
     * @private
     * @type {String}
     * Possible values: 'TL', 'TR', 'BR', 'BL'
     */
    this.position = options.position || 'TL';
    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.control_ = new ViewHistoryControl();
    this.controls_.push(this.control_);
    this.map_ = map;
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panelViewHistory', {
      collapsible: false,
      position: M.ui.position[this.position],
      collapsedButtonClass: 'g-cartografia-flecha-izquierda',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  destroy() {
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'viewhistory';
  }
}
