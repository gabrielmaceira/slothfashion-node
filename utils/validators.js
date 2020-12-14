function validateTags(tags, error) {
  if (tags === undefined || tags.trim() === '') {
    throw Error(error)
  }
  else {
    return true
  }
}

function isGreaterThanZero(value, error) {
  if (parseInt(value) > 0) {
    return true
  }
  else {
    throw Error(error)
  }
}

function floatIsNullOrGreaterThanZero(value, error) {
  if (parseFloat(value) > 0 || String(value).length === 0) {
    return true
  }
  else {
    throw Error(error)
  }

}

function isStringAndNotEmpty(value, error) {
  if (typeof value !== "string" || value.length === 0) {
    throw Error(error)
  }
  else {
    return true
  }
}

function arrayIsNotEmpty(value, error) {
  if (value !== undefined && value !== null) {
    if (Object.keys(value).length > 0 && typeof value === 'object') {
      return true
    }
    else {
      throw Error(error)
    }
  }
  else {
    throw Error(error)
  }
}

function compararIds(value, otherValue, error) {
  if (parseInt(value) === parseInt(otherValue)) {
    return true
  }
  else {
    throw Error(error)
  }
}

module.exports = {
  validateTags, isGreaterThanZero, floatIsNullOrGreaterThanZero,
  isStringAndNotEmpty, arrayIsNotEmpty, compararIds
}