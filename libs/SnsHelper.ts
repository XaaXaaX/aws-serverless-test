

import { SubscribeCommand, SubscribeCommandInput, SNSClient, UnsubscribeCommandInput, UnsubscribeCommand } from "@aws-sdk/client-sns";

export class SnsHelper {
	private static Region = 'eu-west-1';

	constructor(
		private readonly snsClient = new SNSClient({ 
			region: SnsHelper.Region
		}),
	){}

	public async subscribeToSNS(topicArn: any, url: any): Promise<any> {

		const input: SubscribeCommandInput = {
			TopicArn: topicArn,
			Protocol: "https",
			Endpoint: url,
			ReturnSubscriptionArn: true
		};

		const resp = await this.snsClient.send(new SubscribeCommand(input));
		return resp.SubscriptionArn
	}

	public async unsubscribeFromSNS(subscriptionArn: string) {
		const input : UnsubscribeCommandInput = {
			SubscriptionArn: subscriptionArn
		};

		await this.snsClient.send(new UnsubscribeCommand(input));
		console.log("unsubscribed")
	}
}