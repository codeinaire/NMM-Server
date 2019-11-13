import log from 'lambda-log'

export default (
  metadatas: any
) => {
  // for (const key in metadatas) {
  //   log.options.meta[key] = metadatas[key]
  // }
  log.options.dev = true
  return log
}
