import { ReplaySubject, Subject } from "rxjs"
import { start } from "./webserver";
import { CloudFormationHelper } from './CloudFormationHelper';
import { SnsHelper } from './SnsHelper'
import { IntegrationEvent } from "src/models";


export class MessageHelper {

	private readonly confirmed: Subject<any>;
	private readonly messages: ReplaySubject<any>;
	private readonly cloudFormation: any;
	private readonly Sns: SnsHelper;

	constructor() {
		this.confirmed = new Subject()
		this.messages = new ReplaySubject(10)
		this.cloudFormation = new CloudFormationHelper();
		this.Sns = new SnsHelper();
	}

	public async startPolling(): Promise<any> {
		const { url, stop: stopServer } = await start(
			() => this.confirmed.next("confirmed"),
			(msg: any) => this.messages.next(msg))

		const topicArn = await this.cloudFormation.getOutputFormStack("SnsTopicArn")
		const subscriptionArn = await this.Sns.subscribeToSNS(topicArn, url)
		return new Promise((resolve) => {
			this.confirmed.subscribe(() => resolve({
				stop: async () => {
					await stopServer()
					await this.Sns.unsubscribeFromSNS(subscriptionArn)
				}
			}))
		})
	}


	public async waitForMessage(msg: IntegrationEvent): Promise<IntegrationEvent> {

		return new Promise<IntegrationEvent>((resolve) => {
			this.messages.subscribe((incoming): void  => {
				const response = JSON.parse(incoming) as IntegrationEvent;
				if(this.validateMessage(response, msg))
				 	resolve(response);
			})
		})
	}


	private validateMessage<T extends IntegrationEvent>(response: T, msg: T) {
		return response.id === msg.id;
	}
}