const store = {
  db: [],
  junk: [],
  get() {
    return this.db
  },
  getJunk() {
    return this.junk
  },
  set(item) {
    this.db.unshift(item)
  },
  undo() {
    let _junk = this.db.shift()
    this.junk = _junk
    return _junk
  },
  clear() {
    this.db.length = 0
    this.junk.length = 0
  },
}

export {
  store
}