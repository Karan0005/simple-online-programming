/* eslint-disable */

import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

module.exports = async function () {
    // Configure axios for tests to use.
    dotenv.config({ path: path.resolve(process.env.PWD ?? process.cwd(), '.env') });

    const host = 'localhost';
    const port = process.env.PORT_BACKEND ?? '8000';
    axios.defaults.baseURL = `http://${host}:${port}`;
};
