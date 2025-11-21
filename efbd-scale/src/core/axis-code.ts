export enum AxisCode {
  EBF_SOCIAL = 'EBF-SOCIAL',
  EBF_MIND = 'EBF-MIND',
  EBF_DECLINE = 'EBF-DECLINE',
  EBF_EXPOSURE = 'EBF-EXPOSURE',
  EBF_ABANDON = 'EBF-ABANDON',
}

export const ALL_AXIS_CODES: AxisCode[] = [
  AxisCode.EBF_SOCIAL,
  AxisCode.EBF_MIND,
  AxisCode.EBF_DECLINE,
  AxisCode.EBF_EXPOSURE,
  AxisCode.EBF_ABANDON,
];

export function isAxisCode(value: string): value is AxisCode {
  return ALL_AXIS_CODES.includes(value as AxisCode);
}

export function assertAxisCode(value: string): AxisCode {
  if (!isAxisCode(value)) {
    throw new Error(`Unknown axis code: ${value}`);
  }
  return value;
}
