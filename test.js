const t = require('tap')
const waypoints = require('./waypoints.json')
const VehicleState = require('./VehicleState')

t.beforeEach(() => {
  t.context.vehicleState = new VehicleState()
})

t.test('vehicle state should use first waypoint as base', async t => {
  t.context.vehicleState.recordWaypoint(waypoints[0])
  t.equal(t.context.vehicleState.previousWaypoint, waypoints[0], 'first waypoint recorded')
  t.equal(t.context.vehicleState.totalDistance, 0), 'first waypoint does not affect distance/duration stats'
})

t.test('total distance should be the sum of the distance between all coords', async t => {
  for (let waypoint of waypoints) {
    t.context.vehicleState.recordWaypoint(waypoint)
  }
  t.equal(t.context.vehicleState.totalDistance, 202)
})

t.test('total duration should be the sum of the diff between first and last waypoint', async t => {
  for (let waypoint of waypoints) {
    t.context.vehicleState.recordWaypoint(waypoint)
  }
  const totalDuration  = (new Date(waypoints[waypoints.length - 1].timestamp) - new Date(waypoints[0].timestamp)) / 1000
  t.equal(t.context.vehicleState.totalDuration, totalDuration)
})

t.test('speeding distance should be calculated correctly', async t => {
  for (let waypoint of waypoints) {
    t.context.vehicleState.recordWaypoint(waypoint)
  }
  t.equal(t.context.vehicleState.speedingDistance, 202)
})

t.test('speeding duration should be calculated correctly', async t => {
  for (let waypoint of waypoints) {
    t.context.vehicleState.recordWaypoint(waypoint)
  }
  t.equal(t.context.vehicleState.speedingDuration, 20)
})

t.test('speeding logic should only kick in when speeding', async t => {
  for (let waypoint of waypoints) {
    t.context.vehicleState.recordWaypoint(waypoint)
  }
  // Adding a waypoint which has smaller difference in coords
  // compared to the duration to differentiate the total distance
  // with speeding distance
  t.context.vehicleState.recordWaypoint({
    timestamp: '2016-06-21T12:00:25.000Z',
    position: {
      latitude: 59.3326,
      longitude: 18.0666
      },
    speed: 4,
    speed_limit: 8.33
  })
  t.equal(t.context.vehicleState.speedingDistance, 202)
  t.equal(t.context.vehicleState.totalDistance, 235)
  t.equal(t.context.vehicleState.speedingDuration, 20)
  t.equal(t.context.vehicleState.totalDuration, 25)
})

