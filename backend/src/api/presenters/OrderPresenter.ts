import Order from '../../core/Order.js';

interface BrickResponse {
  id?: string;
  brickId: string;
  propertyId: string;
  finalPrice: number;
}

interface PropertyResponse {
  name: string;
  bricks: BrickResponse[];
}

interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  confirmedAt?: Date;
  completedAt?: Date;
  termsAcceptedAt: Date;
  status: string;
  properties: PropertyResponse[];
}

class OrderPresenter {
  static present(data: Order): OrderResponse {
    const propertyMap: Record<string, PropertyResponse> = {};

    data.getItems().forEach(item => {
      const propertyId = item.brick.property.id;
      const propertyName = item.brick.property.name;

      if (!propertyMap[propertyId]) {
        propertyMap[propertyId] = {
          name: propertyName,
          bricks: []
        };
      }

      propertyMap[propertyId].bricks.push({
        id: item.id,
        brickId: item.brick.id,
        propertyId,
        finalPrice: item.finalPrice
      });
    });

    return {
      id: data.id!,
      userId: data.user.id,
      totalAmount: data.totalAmount,
      confirmedAt: data.getConfirmedAt() ?? undefined,
      completedAt: data.getCompletedAt() ?? undefined,
      termsAcceptedAt: data.getTermsAcceptedAt()!,
      status: data.getStatus(),
      properties: Object.values(propertyMap)
    };
  }
}

export default OrderPresenter;
