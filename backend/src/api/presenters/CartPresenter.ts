import Cart from '../../core/Cart.js';

interface BrickResponse {
  id?: string;
  brickId: string;
  propertyId: string;
  priceAtAddTime: number;
}

interface PropertyResponse {
  name: string;
  bricks: BrickResponse[];
}

interface CartResponse {
  id: string;
  userId: string;
  status: string;
  properties: PropertyResponse[];
}

class CartPresenter {
  static present(data: Cart): CartResponse {
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
        priceAtAddTime: item.priceAtAddTime
      });
    });

    return {
      id: data.id,
      userId: data.user.id,
      status: data.getStatus(),
      properties: Object.values(propertyMap)
    };
  }
}

export default CartPresenter;
