export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    monthlyBudget: number;
    currency: string;
    createdAt: Date;
}