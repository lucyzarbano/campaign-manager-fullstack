import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { reset_campaign_updates } from "../src/services/campaign.js";

beforeEach(() => {
    reset_campaign_updates();
});

describe("GET /api/campaigns", () => {
    it("returns the campaign list with pagination", async () => {
        const response = await request(app).get("/api/campaigns");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.pagination).toEqual({
            page: 1,
            limit: 20,
            total: expect.any(Number),
            total_pages: expect.any(Number)
        });
    });

    it("returns the requested pagination page and limit", async () => {
        const response = await request(app).get(
            "/api/campaigns?page=2&limit=5"
        );

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(5);
        expect(response.body.pagination).toMatchObject({
            page: 2,
            limit: 5
        });
    });

    it("searches campaigns by name", async () => {
        const response = await request(app).get(
            "/api/campaigns?q=HomePro"
        );

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);

        for (const campaign of response.body.data) {
            expect(campaign.name.toLowerCase().includes("homepro")).toBe(true);
        }
    });

    it("searches campaigns by id", async () => {
        const response = await request(app).get("/api/campaigns?id=1");

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].id).toBe(1);
    });

    it("filters paused campaigns", async () => {
        const response = await request(app).get(
            "/api/campaigns?status=0"
        );

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);

        for (const campaign of response.body.data) {
            expect(campaign.status).toBe(0);
        }
    });

    it("filters active campaigns", async () => {
        const response = await request(app).get(
            "/api/campaigns?status=1"
        );

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);

        for (const campaign of response.body.data) {
            expect(campaign.status).toBe(1);
        }
    });
});

describe("GET /api/campaigns/:id", () => {
    it("returns an existing campaign", async () => {
        const response = await request(app).get("/api/campaigns/1");

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({
            id: 1,
            name: expect.any(String),
            status: expect.any(Number),
            landingUrl: expect.any(String),
            coverImageUrl: expect.any(String),
            createdAt: expect.any(String)
        });
    });

    it("returns 404 when the campaign does not exist", async () => {
        const response = await request(app).get("/api/campaigns/999999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Campaign not found"
        });
    });
});

describe("PUT /api/campaigns/:id", () => {
    it("updates a campaign and persists it in memory", async () => {
        const payload = {
            id: 1,
            name: "test name",
            status: 0,
            landingUrl: "https://example.com/test-landing",
            coverImageUrl: "https://example.com/test-cover.jpg"
        };

        const response = await request(app)
            .put("/api/campaigns/1")
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(payload);

        const campaignResponse = await request(app).get("/api/campaigns/1");

        expect(campaignResponse.status).toBe(200);
        expect(campaignResponse.body.data).toMatchObject(payload);
    });

    it("rejects a body id that differs from the route id", async () => {
        const response = await request(app)
            .put("/api/campaigns/1")
            .send({ id: 2 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Body id must match route id");
    });

    it("rejects a status different from 0 and 1", async () => {
        const response = await request(app)
            .put("/api/campaigns/1")
            .send({ id: 1, status: 10 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Status must be 0 or 1");
    });

    it("rejects an invalid landing URL", async () => {
        const response = await request(app)
            .put("/api/campaigns/1")
            .send({ id: 1, landingUrl: "not-a-valid-url" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("landingUrl must be a valid URL");
    });
});