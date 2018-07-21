let randomRange = function(under, over) {
  return Math.ceil(Math.random() * (over - under) + under)
}
export default randomRange;