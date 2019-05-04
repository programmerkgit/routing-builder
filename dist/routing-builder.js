"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p = require('path');
/* Should Be Carefully Tested */
/*
*
*   Usage
*
*   routingBuilder(userRouter , builder => {
*
*       builder.use('*', [isLogin], builder => {
*
*           builder.post('*', [idAdmin],  builder => {
*
*               builder.use('/', [create])
*
*           } )
*
*
*           builder.put('*', [isAdmin], builder => {
*
*                builder.use('/:id', [update])
*
*           } )
*
*       })
*   })
*
* */
class RoutingBuilder {
    constructor(router, basePath = '', methodName = 'use') {
        this.router = router;
        this.basePath = basePath;
        this.methodName = methodName;
    }
    /*
    *
    *  use calls router.use
    *
    *  when nested other method, that method is called
    *
    *  builder.get('*', [], (builder) => {
    *
    *       builder.use('/:id', [update]) <= get is called

    *  })
    *
    * */
    use(path, handlers, cb) {
        this.method('use', path, handlers, cb);
    }
    get(path, handlers, cb) {
        this.method('get', path, handlers, cb);
    }
    post(path, handlers, cb) {
        this.method('post', path, handlers, cb);
    }
    put(path, handlers, cb) {
        this.method('put', path, handlers, cb);
    }
    delete(path, handlers, cb) {
        this.method('delete', path, handlers, cb);
    }
    getMergePath(path) {
        if (this.basePath.match(/\*$/)) {
            return p.join(this.basePath.slice(0, -1), path);
        }
        else {
            return p.join(this.basePath, path);
        }
    }
    /*
    *
    *  when method is 'use' or 'null', method is overridden
    *  when other method is already set, that method is used
    *  when incompatible method was passed, throw Error
    *
    *
    * */
    getMergeMethodName(methodName) {
        if (this.methodName === 'use' || !this.methodName) {
            return methodName;
        }
        else {
            if (this.methodName !== methodName) {
                throw new TypeError(`different method name was called '${this.methodName}' and '${methodName}'`);
            }
            else {
                return this.methodName;
            }
        }
    }
    /*
    *
    *  router.method(joinedPath, [handler]) is called
    *
    *  if method is nested raise error
    *
    *  builder.get('*', [] , builder => {
    *
    *       builder.post('/:id', [])  <= nested method is not permitted
    *
    *       builder.get('/:id', []) <=  nested get is just ignored. same as nested use
    *
    *  })
    *
    *
    * */
    method(methodName, path, handlers, cb) {
        handlers = typeof handlers === 'function' ? [handlers] : handlers;
        const mergedMethodName = this.getMergeMethodName(methodName);
        /* If callback function passed, all nested routes should be matched */
        let matchPath = cb ? [path, p.join(path, '*')] : path;
        if (0 < handlers.length) {
            this.router[mergedMethodName](matchPath, handlers);
        }
        if (cb) {
            cb(new RoutingBuilder(this.router, this.getMergePath(path), mergedMethodName));
        }
    }
}
exports.RoutingBuilder = RoutingBuilder;
function routingBuilder(router, callback) {
    callback(new RoutingBuilder(router));
}
exports.routingBuilder = routingBuilder;
//# sourceMappingURL=../src/dist/routing-builder.js.map