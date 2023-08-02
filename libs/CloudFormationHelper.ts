
import { CloudFormationClient, DescribeStacksCommand, DescribeStacksCommandInput } from "@aws-sdk/client-cloudformation";

export class CloudFormationHelper {
	private static Region = 'eu-west-1';
	private static stackName = process.env.StackName

	constructor(private readonly cloudFormationClient: CloudFormationClient = new CloudFormationClient({
			region: CloudFormationHelper.Region
		})
	){}

	public async getOutputFormStack(outputName: string): Promise<any> {
		console.log(process.env.StackName)
		const input: DescribeStacksCommandInput = {
			StackName: CloudFormationHelper.stackName
		};

		const resp = await this.cloudFormationClient.send(new DescribeStacksCommand(input));

		return resp.Stacks[0]
			.Outputs
			.find((x: any) => x.OutputKey === outputName)
			.OutputValue
	}
}