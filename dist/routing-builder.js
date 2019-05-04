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
    constructor(router, basePath = '', methodName) {
        this.router = router;
        this.basePath = basePath;
        this.methodName = methodName;
    }
    get basePath() {
        return this.basePath;
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
            if (this.methodName === methodName) {
                new TypeError(`different method name was called ${this.methodName} ${methodName}`);
            }
            return this.methodName;
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
        const mergedMethodName = this.getMergeMethodName(methodName);
        this.router[mergedMethodName](this.getMergePath(path), handlers);
        if (cb) {
            cb(new RoutingBuilder(this.router, this.getMergePath(path), mergedMethodName));
        }
    }
}
function routingBuilder(router, callback) {
    callback(new RoutingBuilder(router));
}
exports.routingBuilder = routingBuilder;
//# sourceMappingURL=../src/dist/routing-builder.js.map