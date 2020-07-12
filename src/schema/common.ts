export interface CommonSchema<T extends String> {
  // 唯一 ID
  _id: T,
  // 创建时间
  created: Date,
  // 最后更新时间
  updated: Date,
}
