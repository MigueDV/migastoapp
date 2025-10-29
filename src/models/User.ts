export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    monthlyBudget: number;
    createdAt: Date;
}