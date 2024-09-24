import axios from 'axios';

describe('GET /api', () => {
    it('It should success checking root route', async () => {
        const res = await axios.get(`/api`);
        expect(res.status).toBe(200);
        expect(res.data.IsSuccess).toBe(true);
    });
});

describe('GET /api/health', () => {
    it('It should success checking health route', async () => {
        const res = await axios.get(`/api/health`);
        expect(res.status).toBe(200);
        expect(res.data.IsSuccess).toBe(true);
    });
});
