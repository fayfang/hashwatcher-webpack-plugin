const JsonRender = function (compilation) {
  let output = []
  let chunks = compilation.chunks
    
  chunks.forEach((chunk) => {
    output.push({
      type: 'chunk',
      id: chunk.id,
      name: chunk.name,
      debugId: chunk.debugId,
      hash: chunk.hash,
      renderedHash: chunk.renderedHash,
    })
  })

  output.push({
    type: 'total',
    name: compilation.name || 'webpackHashTotal',
    hash: compilation.hash,
    fullHash: compilation.fullHash,
  })

  output = 'webpackHashManager && webpackHashManager(' + JSON.stringify(output) + ')'
  return output
}

module.exports = JsonRender
