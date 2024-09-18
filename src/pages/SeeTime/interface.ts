export interface SeeData {
  id: number;
  startTime: string;
  endTime: string;
  remark: string;
  thisTime: number;
  totalDuration: number;
  date:string;            // 聚合后日期
  count: number;          // 聚合后计次
}