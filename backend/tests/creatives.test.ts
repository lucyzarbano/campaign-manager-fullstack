import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { reset_creatives } from "../src/services/creative.js";
import {
    create_test_image_data_url,
    create_test_not_valid_image_data_url
} from "./helpers/images.js";

beforeEach(() => {
    reset_creatives();
});

describe("GET /api/campaigns/:id/creatives", () => {
    it("returns 404 when the campaign does not exist", async () => {
        const response = await request(app).get(
            "/api/campaigns/999999/creatives"
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Campaign not found");
    });
});

describe("POST /api/campaigns/:id/creatives", () => {
    it("creates a valid 320x480 creative", async () => {
        const assetUrl = await create_test_image_data_url();

        const response = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl });

        expect(response.status).toBe(201);
        expect(response.body.data).toMatchObject({
            id: expect.any(String),
            campaignId: 3,
            assetUrl,
            createdAt: expect.any(String)
        });

        const listResponse = await request(app).get(
            "/api/campaigns/3/creatives"
        );

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.data).toHaveLength(1);
        expect(listResponse.body.data[0].id).toBe(response.body.data.id);
    });

    it("rejects an image that is not 320x480", async () => {
        const assetUrl = await create_test_not_valid_image_data_url();

        const response = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Creative images must be 320x480"
        );
    });

    it("rejects uploads for a paused campaign", async () => {
        const campaignsResponse = await request(app).get(
            "/api/campaigns?status=0&limit=1"
        );

        expect(campaignsResponse.status).toBe(200);
        expect(campaignsResponse.body.data.length).toBeGreaterThan(0);

        const pausedCampaign = campaignsResponse.body.data[0];
        const assetUrl = await create_test_image_data_url();
        const response = await request(app)
            .post(`/api/campaigns/${pausedCampaign.id}/creatives`)
            .send({ assetUrl });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Paused campaigns cannot accept new creatives"
        );
    });

    it("rejects a fourth creative for the same campaign", async () => {

        const assetUrl_1 = await create_test_image_data_url();
        const assetUrl_2 = await create_test_image_data_url();
        const assetUrl_3 = await create_test_image_data_url();
        const assetUrl_4 = await create_test_image_data_url();

        const response_1 = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl: assetUrl_1 });
        const response_2 = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl: assetUrl_2 });
        const response_3 = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl: assetUrl_3 });
        const response_4 = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl: assetUrl_4 });

        expect(response_1.status).toBe(201);
        expect(response_2.status).toBe(201);
        expect(response_3.status).toBe(201);
        expect(response_4.status).toBe(400);
        expect(response_4.body.message).toBe(
            "A campaign can have at most 3 creatives"
        );
    });

});

describe("DELETE /api/campaigns/:id/creatives/:creativeId", () => {
    it("deletes an existing creative", async () => {
        const assetUrl = await create_test_image_data_url();
        const createResponse = await request(app)
            .post("/api/campaigns/3/creatives")
            .send({ assetUrl });

        expect(createResponse.status).toBe(201);

        const creativeId = createResponse.body.data.id;
        const deleteResponse = await request(app).delete(
            `/api/campaigns/3/creatives/${creativeId}`
        );

        expect(deleteResponse.status).toBe(204);

        const listResponse = await request(app).get(
            "/api/campaigns/3/creatives"
        );

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.data).toHaveLength(0);
    });

    it("returns 404 when the creative does not exist", async () => {
        const response = await request(app).delete(
            "/api/campaigns/3/creatives/not-existing-id"
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Creative not found");
    });
});