export const EventEmitter = {
  events: {},
  dispatch(event: string, data: any) {
    if (!this.events[event]) {return}
    this.events[event].forEach(callback => callback(data))
  },
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.events[event]) {this.events[event] = []}
    this.events[event].push(callback)
  },
  unSubscribe(event: string) {
    if (!this.events[event]) {return}
    delete this.events[event]
  },
}
