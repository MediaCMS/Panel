"use strict"

import v8 from 'v8'
import { ObjectId } from 'mongodb'

export default class Controller {

    db;
    filter = {
        match: { },
        sort: { 'time': -1 }, 
        skip: 0, 
        limit: 100
    };

    constructor(db) {
        this.db = db;
    }

    getFilter(query) {
        const filter = v8.deserialize(v8.serialize(this.filter));
        if (typeof query['категорія'] !== 'undefined') {
            filter.match['category._id'] = new ObjectId(query['категорія']);
        } 
        if (typeof query['мітка'] !== 'undefined') {
            filter.match['tags'] = new ObjectId(query['мітка']);
        } 
        if (typeof query['автор'] !== 'undefined') {
            filter.match['user._id'] = new ObjectId(query['автор']);
        } 
        if (typeof query['сортування-поле'] !== 'undefined') {
            const direction = (typeof query['сортування-напрям'] !== 'undefined')
                ? parseInt(query['сортування-напрям'])
                : 1;
            filter.sort = { [query['сортування-поле']] : direction};
        }
        if (typeof query['обмеження'] !== 'undefined') {
            filter.limit = parseInt(query['обмеження']);
        }
        if (typeof query['пропустити'] !== 'undefined') {
            filter.skip = parseInt(query['пропустити']);
        }
        return filter;
    }

    toAlias(title) {
        return title.toLowerCase().replace(/\s/g, '-')
    }
}