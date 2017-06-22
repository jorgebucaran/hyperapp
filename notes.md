# App lifecycle

1. build state from app and mixins
2. init()
2.1 build actions
2.1.1 prepare render => "update"
3. build events from app and mixins
4. DOM content loaded => load()
5. load()
5.1 render() => "loaded"
6. render()
6.1 patch() => "render"
7. patch()
7.1 new node
7.2 existing node => compare oldNode data with newNode data
7.2.1 get old and new children
7.2.2 get reusable children
7.2.3 compare children
7.2.4 patch children
7.2.5 remove old elements if they don't exist anymore
7.3 node replacement
7.4 return element


# Component lifecycle

1. build state from app and mixins
2. build events from app and mixins (app 3.)
3. send state and events to app via mediator
...WIP
... it looks like that component is practically the same as app so I need only to implement some specific parts (state as function, and connecting actions)
