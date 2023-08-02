/**
 * @jest-environment node
 */

import { MessageHelper } from "../libs/MessageHelper" //refactoring dependencis
import { ApiHelper } from "../libs/ApiHelper";
import { CloudFormationHelper } from '../libs/CloudFormationHelper';
import { JestAdapter } from "../libs/JestAdapter";
import { CreateIntegrationEvent, EventType, IntegrationEvent } from "../src/models";
import { ApiRequest } from "../__mock__/request/apiRequest";
import { randomUUID } from "crypto";

JestAdapter.SetTimeOut();


describe("Async Eventing Validation", () => {
  let poller: any;
  let apiHelper: ApiHelper;
  let cfn = new CloudFormationHelper();
  let messageHelper = new MessageHelper();
  const ApiEndpoint = "ApiEndpoint";

  beforeAll(async () => {
    poller = await messageHelper.startPolling();
    let url = await cfn.getOutputFormStack(ApiEndpoint)
    apiHelper = new ApiHelper(url, 'api/v1');
  })

  afterAll(async () => {
    await poller.stop()
  })

  test(`Valid %s Lead => 200 Sucess => SNS Push`, async () => {

    const myEntity = ApiRequest;
    const response = await apiHelper.PostLead(myEntity);

    const id = response.data.id;

    const expected = CreateIntegrationEvent({ entityId: randomUUID() }, EventType.Created);
    const returnedMessageFromSns = await messageHelper.waitForMessage(expected);

    let parsedEvent = returnedMessageFromSns as IntegrationEvent;

    expect(parsedEvent.category).toBe("INTEGRATION");
    expect(parsedEvent.source).toBe("platform:lead-management:intake");
    expect(parsedEvent.id).toBe(id);
    expect(parsedEvent.idempotencyKey).toBeDefined();
    expect(parsedEvent.specVersion).toBe("1.0.2");
    expect(parsedEvent.correlationId).toBeDefined();
    expect(parsedEvent.dataVersion).toBe("1.0.0");
  });
});