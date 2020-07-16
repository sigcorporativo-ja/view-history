/**
 * @module M/impl/control/ViewHistoryControl
 */
export default class ViewHistoryControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    super.addTo(map, html);

    /**
     * List of navigated views. { center: [lng, lat], resolution: x }
     * @private
     */
    this.history_ = [];

    /**
     * Counter for current view index on this.history_.
     * @private
     */
    this.historyNow_ = -1;

    /**
     * Checks if next view is already saved.
     * @private
     */
    this.clickBtn_ = false;

    /**
     * Checks if there's previous history view (index)
     * @private
     */
    this.activePrevious_ = false;
  }

  /**
   * This function registers view events on map.
   *
   * @function
   * @public
   * @api stable
   */
  registerViewEvents() {
    this.facadeMap_.getMapImpl().on('moveend', () => {
      this.registerZoom_();
    });
  }

  /**
   * This function registers zoom on history.
   *
   * @function
   * @private
   */
  registerZoom_() {
    if (this.clickBtn_) {
      this.clickBtn_ = false;
      return;
    }
    const properties = {
      center: this.facadeMap_.getMapImpl().getView().getCenter(),
      resolution: this.facadeMap_.getMapImpl().getView().getResolution(),
    };
    if (this.activePrevious_) {
      this.history_[this.history_.length - 1] = properties;
      this.activePrevious_ = false;
    } else {
      this.history_.push(properties);
    }
    this.historyNow_ += 1;
    this.clickBtn_ = false;
  }

  /**
   * This function shows the previous zoom change to the map.
   *
   * @public
   * @function
   * @api stable
   */
  previousStep() {
    if (this.historyNow_ > 0) {
      const previousCenter = this.history_[this.historyNow_ - 1].center;
      const previousResolution = this.history_[this.historyNow_ - 1].resolution;
      this.clickBtn_ = true;
      this.historyNow_ -= 1;
      this.activePrevious_ = true;
      this.facadeMap_.getMapImpl().getView().setCenter(previousCenter);
      this.facadeMap_.getMapImpl().getView().setResolution(previousResolution);
    }
  }

  /**
   * This function shows the next zoom change to the map
   *
   * @public
   * @function
   * @api stable
   */
  nextStep() {
    if (this.historyNow_ < this.history_.length - 1) {
      const nextCenter = this.history_[this.historyNow_ + 1].center;
      const nextResolution = this.history_[this.historyNow_ + 1].resolution;
      this.clickBtn_ = true;
      this.historyNow_ += 1;
      this.facadeMap_.getMapImpl().getView().setCenter(nextCenter);
      this.facadeMap_.getMapImpl().getView().setResolution(nextResolution);
    }
  }
}
