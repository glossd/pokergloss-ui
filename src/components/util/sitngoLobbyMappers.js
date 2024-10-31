export function toSeats(sitngoLobby) {
  let seats = []
  for (let i = 0; i < sitngoLobby.lobbyTable.size; i++) {
    seats.push({position: i})
  }
  sitngoLobby.entries.forEach(entry => {
    seats[entry.position].player = {userId: entry.userId, username: entry.username, picture: entry.picture}
  })
  return seats
}