export interface ORUData {
  msg_no: string;
  id: string;
  name: string;
  dob: string;
  gender: string;
  highRisk: {
    result: boolean;
    detail: string[];
  };
}
