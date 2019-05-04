"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routing_builder_1 = require("./routing-builder");
describe('routing-builder', () => {
    const express = require('express');
    const request = require('supertest');
    const useMW = function (req, res, next) {
        next();
    };
    beforeAll(() => {
    });
    describe('get', () => {
        it('should * work', function (done) {
            const app = express();
            const body = { foo: 'bar' };
            const next = ((req, res, next) => {
                next();
            });
            const get = (req, res, next) => {
                res.json({ foo: 'bar' });
            };
            routing_builder_1.routingBuilder(app, builder => {
                builder.use('*', [next], builder => {
                    builder.get('/a', [get]);
                });
            });
            request(app).get('/a')
                .expect(body)
                .end(done);
        });
        it('should nest routing', function (done) {
            const app = express();
            const body = { foo: 'bar' };
            const next = ((req, res, next) => {
                next();
            });
            const get = (req, res, next) => {
                res.json({ foo: 'bar' });
            };
            routing_builder_1.routingBuilder(app, builder => {
                builder.use('/users', [get], builder => {
                    builder.get('*', [next], builder => {
                        builder.get('/:id', [next]);
                    });
                });
            });
            request(app).get('/users/a')
                .expect(body)
                .end(done);
        });
        it('should call use get', function (done) {
            const app = express();
            const body = { foo: 'bar' };
            const next = ((req, res, next) => {
                next();
            });
            const get = (req, res, next) => {
                res.json({ foo: 'bar' });
            };
            routing_builder_1.routingBuilder(app, builder => {
                builder.use('*', [next], builder => {
                    builder.use('/a', [get], builder => {
                        builder.get('/b', [next]);
                    });
                });
            });
            request(app).get('/a/b')
                .expect(body)
                .end(done);
        });
        it('should error use get post', function () {
        });
        it('should path *', function () {
        });
        it('should call get', function (done) {
            const app = express();
            routing_builder_1.routingBuilder(app, (builder) => {
                builder.get('/a', [(req, res, next) => {
                        res.json({ foo: 'bar' });
                    }]);
            });
            request(app).get('/a')
                .expect({ foo: 'bar' })
                .end(done);
        });
        it('should app truthy', function () {
            const app = express();
            routing_builder_1.routingBuilder(app, builder => {
                builder.use('/users', [useMW], builder => {
                    builder.get('*', [useMW], builder => {
                        builder.get('/', [useMW]);
                        builder.get('/:id', [useMW]);
                    });
                    builder.post('*', [useMW], builder => {
                        builder.post('/', [useMW]);
                    });
                    builder.put('/', [], builder => {
                        builder.put('/:id', []);
                    });
                    builder.delete('/', [], builder => {
                        builder.delete('/:id', []);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=../src/dist/routing-builder.spec.js.map