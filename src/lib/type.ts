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
    accessToken: string | null;
    setAccessToken: Dispatch<SetStateAction<string | null>>
    refreshToken: string | null;
    setRefreshToken: Dispatch<SetStateAction<string | null>>;
    Logout: ()=> void
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