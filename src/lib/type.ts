import type { Dispatch, SetStateAction } from "react";

export interface User {
    Username: string;
    FullName: string;
    Email: string;
    Avatar: string;
    Role: {
        Id: number;
        Title: string;
    };
    GiftingCountry: {
        Id: string;
        Name: string;
    };
    Currency: {
        Id: string;
        Symbol: string;
    };
}

export interface AuthInfo {
    user: User | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<User | null>>;
    Logout: ()=> void;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}

export interface Material {
    Id: number
    Title: string
    SubTitle?: string
    BrandName: string
    CoverPhoto: string
    SalesPrice: number
    SalesPriceInUsd: number
    VariantTitle?: string
    VariantId?: number
    TypeId?: number
}