import { routingBuilder } from './routing-builder';
import { RequestHandler } from 'express-serve-static-core';

describe('routing-builder', () => {
    const express = require('express');
    const request = require('supertest');
    const useMW = function (req, res, next) {
        next();
    };
    beforeAll(() => {

    });
    describe('get', () => {
        describe('/users /a', () => {
            const app = express();
            const body = {foo: 'bar'};
            const next: RequestHandler = ((req, res, next) => {
                next();
            });
            const get: RequestHandler = (req, res, next) => {
                res.json({foo: 'bar'});
            };
            routingBuilder(app, builder => {
                builder.get('/users', [ get ], builder => {
                    builder.get('/a', [ next ]);
                });
            });
            it('should match /users', function (done) {
                request(app).get('/users')
                    .expect(body)
                    .end(done);
            });
            it('should match /users/b', function (done) {
                request(app).get('/users/b')
                    .expect(body)
                    .end(done);
            });
            it('should match /users/b/c', function (done) {
                request(app).get('/users/b/c')
                    .expect(body)
                    .end(done);
            });
            it('should not match /users-foo', function (done) {
                request(app).get('/users-foo')
                    .expect({})
                    .end(done);
            });
        });
        it('should * work', function (done) {
            const app = express();
            const body = {foo: 'bar'};
            const next: RequestHandler = ((req, res, next) => {
                next();
            });
            const get: RequestHandler = (req, res, next) => {
                res.json({foo: 'bar'});
            };
            routingBuilder(app, builder => {
                builder.use('*', [ next ], builder => {
                    builder.get('/a', [ get ]);
                });
            });
            request(app).get('/a')
                .expect(body)
                .end(done);
        });
        it('use /users get * get *', function (done) {
            const app = express();
            const body = {foo: 'bar'};
            const next: RequestHandler = ((req, res, next) => {
                next();
            });
            const get: RequestHandler = (req, res, next) => {
                res.json({foo: 'bar'});
            };
            routingBuilder(app, builder => {
                builder.use('/users', [ get ], builder => {
                    builder.get('*', [ next ], builder => {
                        builder.get('/:id', [ next ]);
                    });
                });
            });
            request(app).get('/users/a')
                .expect(body)
                .end(done);
        });
        it('should app truthy', function () {
            const app = express();
            routingBuilder(app, builder => {
                builder.use('/users', [ useMW ], builder => {

                    builder.get('*', [ useMW ], builder => {
                        builder.get('/', [ useMW ]);
                        builder.get('/:id', [ useMW ]);
                    });

                    builder.post('*', [ useMW ], builder => {
                        builder.post('/', [ useMW ]);
                    });

                    builder.put('*', [], builder => {
                        builder.put('/:id', []);
                    });

                    builder.delete('*', [], builder => {
                        builder.delete('/:id', []);
                    });

                });
            });
        });
    });
});