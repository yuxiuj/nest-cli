/**
 * Twitter_Snowflake
 * SnowFlake的结构如下(共64bits，每部分用-分开):
 *   0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000
 *   |   ----------------------|----------------------   --|--   --|--   -----|------
 * 1bit不用                41bit 时间戳                  数据标识id 机器id     序列号id
 */
/* tslint:disable:no-bitwise */

export default class SnowFlake {
  private readonly twepoch: bigint;
  private readonly workerIdBits: bigint;
  private readonly dataCenterIdBits: bigint;
  private readonly sequenceBits: bigint;
  private readonly sequenceMask: bigint;
  private readonly workerIdShift: bigint;
  private readonly dataCenterIdShift: bigint;
  private readonly timestampLeftShift: bigint;
  private sequence: bigint;
  private lastTimestamp: bigint;
  private readonly workerId: bigint;
  private readonly dataCenterId: bigint;

  /**
   * 构造函数
   * 运行在内阁
   * @param {bigint} workerId 工作ID (0~31)
   * @param {bigint} dataCenterId 数据中心ID (0~31)
   * @param {bigint} sequence 毫秒内序列 (0~4095)
   */
  constructor(workerId, dataCenterId) {
    // 开始时间截 (2019-11-11) id生成起点 自剁手之后开始
    this.twepoch = 1573430400000n;

    this.workerIdBits = 5n;
    this.dataCenterIdBits = 5n;
    this.sequenceBits = 12n;

    // 支持的最大十进制id
    this.sequenceMask = this.getMaxInt(this.sequenceBits);

    this.workerIdShift = this.sequenceBits;
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;
    this.timestampLeftShift = this.dataCenterIdShift + this.dataCenterIdBits;
    this.sequence = 0n;
    this.lastTimestamp = -1n;

    this.workerId = BigInt(workerId) & this.getMaxInt(this.workerIdBits);
    this.dataCenterId = BigInt(dataCenterId) & this.getMaxInt(this.dataCenterIdBits);
  }

  getId() {
    let timestamp = this.timeGen();
    const diff = timestamp - this.lastTimestamp;
    if (diff < 0n) {
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${-diff} milliseconds`,
      );
    }

    if (diff === 0n) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      if (this.sequence === 0n) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }
    this.lastTimestamp = timestamp;
    return (
      ((timestamp - this.twepoch) << this.timestampLeftShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence
    );
  }

  /**获取n位最大十进制数
   *
   * @param {bigint} n
   * @return{bigint}
   */
  getMaxInt(n: bigint): bigint {
    return -1n ^ (-1n << n);
  }

  /**
   * 阻塞到下一个毫秒，直到获得新的时间戳
   * @param {bigint} lastTimestamp 上次生成ID的时间截
   * @return {bigint} 当前时间戳
   */
  tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  timeGen() {
    return BigInt(+new Date());
  }
}
