// @ts-check
const { test, expect, request } = require('@playwright/test');

test.describe('TMDB API Automation Tests', () => {

    const BASE_URL = 'https://api.themoviedb.org/3';
    const API_KEY = 'add494e96808c55b3ee7f940c9d5e5b6'; // Replace with your TMDB API key

    test('GET Request - Popular Movies', async({ request }) => {
        const response = await request.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc',
                page: 1
            }
        });

        // Assert status and data
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        console.log(`Total Results: ${body.total_results}`);
        expect(body.results.length).toBeGreaterThan(0);

        // Assert first movie object has expected fields
        expect(body.results[0]).toHaveProperty('title');
        expect(body.results[0]).toHaveProperty('vote_average');
    });

    test('GET Request - Newest', async({ request }) => {
        const response = await request.get(`${BASE_URL}/movie/now_playing`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc',
                page: 1
            }
        });

        // Assert status and data
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        console.log(`Total Results: ${body.total_results}`);
        expect(body.results.length).toBeGreaterThan(0);

        // Validate pagination fields
        expect(body).toHaveProperty('total_pages');
        expect(body).toHaveProperty('total_results');

        // Validate first movie object
        const firstMovie = body.results[0];
        expect(firstMovie).toHaveProperty('id');
        expect(firstMovie).toHaveProperty('title');
        expect(firstMovie).toHaveProperty('overview');
        expect(firstMovie).toHaveProperty('release_date');
    });

    test('GET Request - Trending Movies', async({ request }) => {
        const response = await request.get(`${BASE_URL}/trending/movie/week`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc',
                page: 1
            }
        });

        // Assert status and data
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        console.log(`Total Results: ${body.total_results}`);
        expect(body.results.length).toBeGreaterThan(0);

        // Assert first movie object has expected fields
        expect(body.results[0]).toHaveProperty('title');
        expect(body.results[0]).toHaveProperty('vote_average');

        expect(body.results.length).toBeGreaterThan(0);
        const firstMovie = body.results[0];
        expect(firstMovie.media_type).toBe('movie');
        expect(firstMovie).toHaveProperty('title');
    });

    test('GET Request - Top Rated Movies', async({ request }) => {
        const response = await request.get(`${BASE_URL}/movie/top_rated`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc',
                page: 1
            }
        });

        // Assert status and data
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        console.log(`Total Results: ${body.total_results}`);
        expect(body.results.length).toBeGreaterThan(0);

        // Validate structure
        expect(Array.isArray(body.results)).toBeTruthy();
        expect(body.results.length).toBeGreaterThan(0);
        expect(body).toHaveProperty('total_results');

        // Validate first movie object
        const firstMovie = body.results[0];
        expect(firstMovie).toHaveProperty('overview');
        expect(firstMovie).toHaveProperty('vote_average');
    });
});