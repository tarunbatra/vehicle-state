const geoLib = require('geolib')

/**
 * @class Keeps state of the vehicle
 */
class VehicleState {
  constructor () {
    this.totalDistance = 0
    this.totalDuration = 0
    this.speedingDistance = 0
    this.speedingDuration = 0
    this.previousWaypoint = null
  }

  /**
   * Records a waypoint and use it to update
   * the vehicle's state (distance / duration)
   * @param {object} waypoint
   */
  recordWaypoint (waypoint) {
    if (this.previousWaypoint) {
      const distance = calculateDistanceInMeters(this.previousWaypoint, waypoint)
      const duration = calculateDurationInSeconds(this.previousWaypoint, waypoint)
      // NOTE: We are calculating speed here and not relying on the `waypoint.speed`
      // because it represetns the speed at the moment the waypoint was captured.
      // We rather calculate it using the distance between two waypoint coordinates
      const speed = distance / duration
      const speedLimit = waypoint.speed_limit

      this.totalDistance += distance
      this.totalDuration += duration
      if (speed > speedLimit) {
        this.speedingDistance += distance
        this.speedingDuration += duration
      }
    }
    this.previousWaypoint = waypoint
  }
}

/**
 * Calculates time duration b/w two waypoints
 *
 * @param {object} waypointA - Previous waypoint
 * @param {object} waypointB - New waypoint
 * @returns {number} Time in seconds
 */
function calculateDurationInSeconds (waypointA, waypointB) {
  const deltaTime = new Date(waypointB.timestamp) - new Date(waypointA.timestamp)
  return deltaTime / 1000
}

/**
 * Calculates distance travelled b/w two waypoints
 *
 * @param {object} waypointA - Previous waypoint
 * @param {object} waypointB - New waypoint
 * @returns {number} Distance in meters
 */
function calculateDistanceInMeters (waypointA, waypointB) {
  return geoLib.getDistance(waypointA.position, waypointB.position)
}


module.exports = VehicleState