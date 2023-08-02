import * as axios from "axios";

export class ApiHelper {
  private static schema = "https";
  private readonly leadUrl: string;

  constructor(url: string, path: string) {
    this.leadUrl = `${ApiHelper.schema}://${url}/${path}`;
  }

  public PostLead = async (lead: any): Promise<any> => {
    try {
      const response = await axios.default.post(this.leadUrl, JSON.stringify(lead), {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        console.log(`Status ${err.response.status} with reponse ${JSON.stringify(err.response.data)}`);
        return err.response;
      }
    }
  };
}
