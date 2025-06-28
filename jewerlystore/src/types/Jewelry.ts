export interface Jewelry {
    jewelryId: string; // Изменил id на jewelryId
    name: string;
    prise: number; // Используйте prise вместо price
    weight: number;
    inStock: boolean;
    mainImageUrl: string;
    isPremium: boolean;
    createdAt: string; // Изменил Date на string
    updatedAt: string; // Добавил, если нужно
    watches: number; // Добавил, если нужно
    category: number;
}