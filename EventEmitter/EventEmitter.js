;(function (name, definition) {
  let hasDefine = typeof define === 'function' // amd或cmd环境
  let hasExports = typeof module !== 'undefined' && module.exports // node环境
  if (hasDefine) {
    define(definition)
  } else if (hasExports) {
    module.exports = definition()
  } else {
    this[name] = definition()
  }
})('EventEmitter', function () {
  function EventEmitter () {
    this._events = {}
  }

  EventEmitter.prototype.addListener = function (name, listener) {
    if (!this._events[name]) {
      this._events[name] = [listener]
    } else {
      this._events[name].push(listener)
    }
  }

  EventEmitter.prototype.removeListener = function (name, listener) {
    if (!this._events[name]) {
      return
    }
    const index = this._events[name].indexOf(listener)
    index > -1 && this._events[name].splice(index, 1)
  }

  EventEmitter.prototype.emit = function (name, ...data) {
    if (!this._events[name]) {
      return
    }
    this._events[name].forEach(function (fn) {
      fn.apply(null, data)
    })
  }

  EventEmitter.prototype.once = function (name, listener) {
    let wrapper = (...arg) => {
      listener.apply(this, arg)
      this.removeListener(name, wrapper)
    }
    this.addListener(name, wrapper)
  }

  return EventEmitter
})
