const waypoints = require('./waypoints.json')
const VehicleState = require('./VehicleState')

const vehicleState = new VehicleState()

for (let i = 0; i < waypoints.length; i++) {
  vehicleState.recordWaypoint(waypoints[i])
}

console.log(`
State of the vehicle:
    Total distance: ${vehicleState.totalDistance}
    Total duration: ${vehicleState.totalDuration}
    Speeding distance: ${vehicleState.speedingDistance}
    Speeding duration: ${vehicleState.speedingDuration}
`)