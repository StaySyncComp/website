export function buildRoomCode(organizationId: number, locationId: number): string {
  return `BLOOM-${organizationId}-${locationId}`;
}
