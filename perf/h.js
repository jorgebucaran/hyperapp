import bench from 'nanobench'
import h from '../src/h'

bench("vnode with no child 1M times", b => {
  b.start()
  for (let i = 0; i < 10000000; i++) {
    h("div", {})
  }
  b.end()
})

bench("vnode with a single child 1M times", b => {
  b.start()
  for (let i = 0; i < 10000000; i++) {
    h("div", {}, ["foo"])
  }
  b.end()
})

bench("vnode with a single array child 1M times", b => {
  b.start()
  for (let i = 0; i < 10000000; i++) {
    h("div", {}, [["foo"]])
  }
  b.end()
})
